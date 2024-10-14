import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../Components/AdminSidebar";
import CountUp from "react-countup";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Swal from "sweetalert2";
import Badge from "@mui/material/Badge";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Modal from "react-modal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SupplierReport from "./SupplierReport";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import i from '../assets/leaf.jpg'

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [locations, setLocations] = useState([
    { id: 1, name: 'Colombo', lat: 6.9271, lng: 79.8612, plants: ['Plant A', 'Plant B'] },
    { id: 2, name: 'Kandy', lat: 7.2906, lng: 80.6337, plants: ['Plant C'] },
    { id: 3, name: 'Galle', lat: 6.0535, lng: 80.2210, plants: ['Plant D', 'Plant E'] },
    { id: 4, name: 'Jaffna', lat: 9.6615, lng: 80.0255, plants: ['Plant F'] },
  ]);
  const customIcon = new L.Icon({
    iconUrl: i,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const openUpdateModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCollapseChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
    },  }));

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setSelectedSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/supplier/getAllSuppliers");
        setSuppliers(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch suppliers");
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (Array.isArray(suppliers)) {
      const searchResult = suppliers.filter((supplier) =>
        Object.values(supplier).some((value) =>
          String(value).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
      setFilteredSuppliers(searchResult);
    }
  }, [searchValue, suppliers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this Supplier",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/supplier/deleteSupplier/${id}`);
        setSuppliers(suppliers.filter((sup) => sup._id !== id));
        Swal.fire("Deleted!", "The Supplier has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting Supplier:", error);
      Swal.fire("Error", "An error occurred while deleting the Supplier.", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/supplier/updateSupplier/${selectedSupplier._id}`,
        selectedSupplier
      );
      console.log(selectedSupplier)
      Swal.fire("Updated!", "The Supplier has been updated.", "success");
      window.location.reload();
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "An error occurred while updating the Supplier.", "error");
    }
  };

  return (
    <div>
      <AdminSidebar onCollapseChange={handleCollapseChange} />

      <main
        style={{
          marginLeft: isSidebarCollapsed ? "60px" : "220px",
          transition: "margin-left 0.3s",
        }}
        className="bg-slate-200 min-h-screen rounded-2xl"
      >
<header className="flex items-center justify-between h-16 shadow mb-5 rounded-2xl">
          <h2 className="items-center ml-20 font-bold text-2xl">
            Supplier Dashboard
          </h2>
          <input
            type="text"
            placeholder="Search..."
            className="bg-SecondaryColor rounded-md p-2 w-64 outline-none"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <PDFDownloadLink
            document={<SupplierReport suppliers={filteredSuppliers} />}
            fileName="filtered-suppliers.pdf"
          >
            {({ loading }) => (
              <button
                className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Generating PDF..." : "Generate Report"}
              </button>
            )}
          </PDFDownloadLink>
          <div className="flex">
            <Badge color="secondary" badgeContent={100} sx={{ m: 1, mr: 5 }}>
              <NotificationsActiveIcon sx={{ fontSize: 30 }} />
            </Badge>
            <FormGroup>
              <FormControlLabel
                control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
              />
            </FormGroup>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-extrabold text-dark-grey-900">
              <CountUp id="countto1" end={suppliers.length} />
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Total Suppliers
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-extrabold text-dark-grey-900">
              <CountUp id="countto2" end={2000} />+
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Happy Services
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-extrabold text-dark-grey-900">
              <CountUp id="countto3" end={99} />+
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Suppliers
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-extrabold text-dark-grey-900">
              <CountUp id="countto3" end={2020} />
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Since
            </p>
          </div>        
        </div>
        <div className="p-6 ml-10">
          <h2 className="text-2xl font-bold mb-4">Supplier List</h2>

          <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Website</th>
                <th className="border border-gray-300 px-4 py-2">Contact</th>
                <th className="border border-gray-300 px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.website}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {supplier.mobile}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <button
                      type="button"
                      className="bg-pink-600 text-black text-xs px-4 py-2 rounded-md mr-2"
                      onClick={() => openUpdateModal(supplier)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="bg-pink-600 text-black text-xs px-4 py-2 rounded-md "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(supplier._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Update Supplier"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "800px",
              height: "500px",
              padding: "20px",
            },
          }}
        >
          <div className="pl-5 pt-2 pr-5">
            <form>
              <div className="bg-slate-200 p-4 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-5">
                  Update Supplier Information
                </h2>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col w-1/2">
                    <label className="block text-gray-700 required">
                      Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={selectedSupplier.name}
                      onChange={handleUpdateChange}
                      className="border border-gray-300 rounded-md p-2 mr-10"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="block text-gray-700 required">
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={selectedSupplier.email}
                      onChange={handleUpdateChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col w-1/2">
                    <label className="block text-gray-700 required">
                      Website:
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={selectedSupplier.website}
                      onChange={handleUpdateChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="block text-gray-700 required">
                      Contact:
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={selectedSupplier.mobile}
                      onChange={handleUpdateChange}
                      className="border border-gray-300 rounded-md p-2 bg-gray-100"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded-md"
                  onClick={handleUpdate}
                >
                  Update Supplier
                </button>
              </div>
            </form>
          </div>
          <button onClick={closeModal}>
            Close
          </button>
        </Modal>
        <div className="p-6 ml-10">
  <h2 className="text-2xl font-bold mb-4">Sri Lanka Supplier Locations</h2>
  <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
    <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker key={location.id} icon={customIcon} position={[location.lat, location.lng]}>
          <Popup>
            <div>
              <h3 className="font-bold">{location.name}</h3>
              <p>Plants:</p>
              <ul>
                {location.plants.map((plant, index) => (
                  <li key={index}>{plant}</li>
                ))}
              </ul>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
</div>
      </main>
    </div>
  );
};

export default SupplierDashboard;


