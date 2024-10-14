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
import { PDFDownloadLink } from "@react-pdf/renderer";
import InventoryReport from "./InventoryReport";
import { useNavigate } from "react-router-dom";
import { init, send } from "emailjs-com";

const LowInventory = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [items, setItems] = useState([]); // To store fetched items
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To manage error state
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  init("jm1C0XkEa3KYwvYK0");

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
    const searchResult = items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(searchValue.toLowerCase()) &&
        item.quantity <= 20
    );
    setFilteredItems(searchResult);
  }, [searchValue, items]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleDelete = async (item) => {
    console.log(item);
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will re-order this item",
        icon: "warning",
        fontFamily: "Montserrat, sans-serif",
        input: "number", // Adds an input for quantity
        inputLabel: "Enter quantity to reorder",
        inputPlaceholder: "Quantity",
        inputAttributes: {
          min: 1,
          step: 1,
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, re order it!",
        preConfirm: (quantity) => {
          if (!quantity || quantity <= 0) {
            Swal.showValidationMessage("Please enter a valid quantity.");
          }
          return quantity; // Return the quantity inputted
        },
      });

      if (result.isConfirmed) {
        const quantity = result.value; // Get the inputted quantity
        await send("service_fjpvjh9", "template_atolrdf", {
          to_email: item.suplier.supEmail,
          product_name: item.itemName,
          quantity: quantity,
          status: "newStatus",
        });

        Swal.fire(
          "Deleted!",
          `The Item has been re-ordered. Quantity: ${quantity}`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error re-ordering Item:", error);
      Swal.fire(
        "Error",
        "An error occurred while re-ordering the Item.",
        "error"
      );
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
              <CountUp id="countto3" end={1} />+
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
          <h2 className="text-2xl font-bold mb-4">Low Inventory Items</h2>

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
                <tr
                  key={item.id}
                  className={`${item.quantity <= 20 ? "bg-red-200" : ""} `}
                >
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
                      className="bg-pink-600 text-black text-xs px-4 py-2 rounded-md "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                    >
                      Re Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default LowInventory;
