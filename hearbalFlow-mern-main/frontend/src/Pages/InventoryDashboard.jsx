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
import InventoryReport from "./InventoryReport";
import { useNavigate } from "react-router-dom";

const InventoryDashboard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [items, setItems] = useState([]); // To store fetched items
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To manage error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedItem, setSelectedItem] = useState({}); // To store the item being updated
  const [supplier, setSupplier] = useState({
    supId: "",
    supName: "",
    supEmail: "",
    supNIC: "",
    supPhone: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setSupplier({
      supId: item.suplier.supId,
      supName: item.suplier.supName,
      supEmail: item.suplier.supEmail,
      supNIC: item.suplier.supNIC,
      supPhone: item.suplier.supPhone,
    });
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
    },
  }));

  const handleSupUpdateChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prew) => ({
      ...prew,
      [name]: value,
    }));
    console.log(selectedItem);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(selectedItem);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/item/get");
        setItems(response.data);

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch items");
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const searchResult = items.filter((item) =>
      item.itemName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredItems(searchResult);
  }, [searchValue, items]);

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
        text: "You will not be able to recover Item",
        icon: "warning",
        fontFamily: "Montserrat, sans-serif",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/item/delete/${id}`);
        setItems(items.filter((rep) => rep._id !== id));
        Swal.fire("Deleted!", "The Item has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting Item:", error);
      Swal.fire("Error", "An error occurred while deleting the Item.", "error");
    }
  };

  const handleUpdate = async () => {
    try {
      const requestBody = {
        itemName: selectedItem.itemName,
        category: selectedItem.category,
        sku: selectedItem.sku,
        mfd: selectedItem.mfd,
        exp: selectedItem.exp,
        price: selectedItem.price,
        quantity: selectedItem.quantity,
        description: selectedItem.description,
        imageURL: selectedItem.imageURL,
        suplier: {
          supId: supplier.supId,
          supName: supplier.supName,
          supEmail: supplier.supEmail,
          supNIC: supplier.supNIC,
          supPhone: supplier.supPhone,
        },
      };
      const response = await axios.put(
        `http://localhost:3000/api/item/update/${selectedItem._id}`,
        requestBody
      );
      Swal.fire("Updated!", "The Item has been updated.", "success");
      window.location.reload();
      console.log(requestBody);
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "An error occurred while updatingthe Item.", "error");
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
            Inventory Dashboard
          </h2>
          <input
            type="text"
            placeholder="Search..."
            className="bg-SecondaryColor rounded-md p-2 w-64 outline-none"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <PDFDownloadLink
            document={<InventoryReport packages={filteredItems} />}
            fileName="filtered-packages.pdf"
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
              <CountUp id="countto1" end={items.length} />
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Inventory Items
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-extrabold text-dark-grey-900">
              <CountUp id="countto2" end={400} />+
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Happy Customers
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-extrabold text-dark-grey-900">
              <CountUp id="countto3" end={10} />+
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Suppliers
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-extrabold text-dark-grey-900">
              <CountUp id="countto3" end={20} />+
            </h3>
            <p className="text-base font-medium text-dark-grey-600">
              Employees
            </p>
          </div>
        </div>

        <div className="p-6 ml-10">
          <h2 className="text-2xl font-bold mb-4">Inventory Items</h2>

          <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Image</th>
                <th className="border border-gray-300 px-4 py-2">Item ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Stock</th>
                <th className="border border-gray-300 px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    <img src={item.imageURL} className="w-20" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.itemId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.itemName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Rs. {item.price}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.quantity}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    <button
                      type="button"
                      className="bg-pink-600 text-black text-xs px-4 py-2 rounded-md mr-2"
                      onClick={() => openUpdateModal(item)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="bg-pink-600 text-black text-xs px-4 py-2 rounded-md "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
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
          contentLabel="Update Item"
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
              height: "700px",
              padding: "20px",
            },
          }}
        >
          {step === 1 && (
            <div className="pl-5 pt-2 pr-5">
              <form>
                <div className="bg-slate-200 p-4 rounded-2xl shadow-sm">
                  <h2 className="text-2xl font-bold mb-5">
                    Section 1: General Information
                  </h2>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col w-1/3">
                      <label className="block text-gray-700 required">
                        Name:
                      </label>
                      <input
                        type="text"
                        name="itemName"
                        value={selectedItem.itemName}
                        onChange={handleUpdateChange}
                        className="border border-gray-300 rounded-md p-2 mr-10"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="block text-gray-700 required">
                        Category:
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={selectedItem.category}
                        onChange={handleUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="block text-gray-700 required">
                        SKU:
                      </label>
                      <input
                        type="text"
                        name="sku"
                        value={selectedItem.sku}
                        onChange={handleUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col w-1/4">
                      <label className="block text-gray-700 required">
                        MFD:
                      </label>
                      <input
                        type="date"
                        name="mfd"
                        value={selectedItem.mfd}
                        onChange={handleUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/4">
                      <label className="block text-gray-700 required">
                        Exp:
                      </label>
                      <input
                        type="date"
                        name="exp"
                        value={selectedItem.exp}
                        onChange={handleUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/4">
                      <label className="block text-gray-700 required">
                        Price:
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={selectedItem.price}
                        onChange={handleUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/4">
                      <label className="block text-gray-700 required">
                        Quantity:
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={selectedItem.quantity}
                        onChange={handleUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 required">
                      Description:
                    </label>
                    <textarea
                      name="description"
                      value={selectedItem.description}
                      onChange={handleUpdateChange}
                      className="border border-gray-300 rounded-md p-2 w-full bg-gray-100"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Upload Image:</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleUpdateChange}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    {/* {uploadProgress > 0 && (
                    <div className="w-full max-w-sm mt-4">
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                            Upload Progress
                          </span>
                          <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                            {Math.round(uploadProgress)}%
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="relative flex items-center justify-center w-full">
                            <div className="w-full bg-gray-200 rounded">
                              <div
                                className="bg-teal-600 text-xs leading-none py-1 text-center text-white rounded"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}
                  </div>
                  <div className="flex items-center mb-4">
                    <button
                      // onClick={handleUpload}
                      // disabled={loading}
                      className="bg-black text-white text-xl px-4 py-2 rounded-md mt-5"
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="pl-16 pt-2 pr-10 mt-20">
              <form>
                <div className="bg-slate-200 p-4 rounded-2xl shadow-sm">
                  <h2 className="text-2xl font-bold mb-5">
                    Section 2: Supplier Information
                  </h2>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col w-1/3">
                      <label className="block text-gray-700 required">
                        Supplier ID:
                      </label>
                      <input
                        type="text"
                        name="supId"
                        value={supplier.supId}
                        onChange={handleSupUpdateChange}
                        className="border border-gray-300 rounded-md p-2 mr-10"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="block text-gray-700 required">
                        Supplier Name:
                      </label>
                      <input
                        type="text"
                        name="supName"
                        value={supplier.supName}
                        onChange={handleSupUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100 mr-10"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="block text-gray-700 required">
                        Supplier Email:
                      </label>
                      <input
                        type="email"
                        name="supEmail"
                        value={supplier.supEmail}
                        onChange={handleSupUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col w-1/2">
                      <label className="block text-gray-700 required">
                        Supplier NIC:
                      </label>
                      <input
                        type="text"
                        name="supNIC"
                        value={supplier.supNIC}
                        onChange={handleSupUpdateChange}
                        className="border border-gray-300 rounded-md p-2 mr-10"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <label className="block text-gray-700 required">
                        Supplier Phone:
                      </label>
                      <input
                        type="tel"
                        name="supPhone"
                        value={supplier.supPhone}
                        onChange={handleSupUpdateChange}
                        className="border border-gray-300 rounded-md p-2 bg-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 text-white p-2 rounded-md mr-4"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 text-white p-2 rounded-md"
                    onClick={handleUpdate}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
          <button on onClick={closeModal}>
            close
          </button>
        </Modal>
      </main>
    </div>
  );
};

export default InventoryDashboard;
