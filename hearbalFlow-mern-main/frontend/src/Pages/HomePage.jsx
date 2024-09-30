import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import modBack from "../assets/homeBach.jpg"; // You may want to update this background image to match a herbal theme
import { motion } from "framer-motion";
import Per from "../assets/performanceimg.jpeg"; // Replace with herbal medicine-related images
import Style from "../assets/stylevehimg.jpeg"; // Replace with herbal medicine-related images
import Effi from "../assets/efficencyimg.jpeg";
import CanB from "../assets/canback2.jpg";
import CanB1 from "../assets/canback.jpg";
import axios from "axios";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div>
      <Navbar />

      {/* Section 1: intro */}
      <div
        className="bg-center bg-cover min-h-screen flex"
        style={{ backgroundImage: `url(${CanB})` }}
      >
        <div className="text-center  text-white w-1/2  mt-48">
          <h2 className="text-5xl bg-slate-600 font-extrabold p-4">
            Embrace Natural Healing
          </h2>
          <p className="mt-10 text-xl p-6">
            Discover the power of herbal medicine for holistic health and
            wellness. Our carefully crafted remedies harness the healing
            properties of nature to help you lead a healthier, balanced life.
            <br /> <br />
            Discover the power of herbal medicine for holistic health and
            wellness. Our carefully crafted remedies harness the healing
            properties of nature to help you lead a healthier, balanced life.
            herbal medicine for holistic health and wellness. Our carefully
            crafted remedies harness the healing properties of nature to help
            you lead a healthier, balanced life.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("benefits")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="mt-6 bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded"
          >
            Explore Remedies
          </button>
        </div>
        <div className="w-1/2"></div>
      </div>

      {/* Section 3:*/}
      <motion.section
        id="benefits"
        className="py-20 bg-gray-100 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-4xl font-bold mb-12">
          Why Choose Herbal Medicine?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img
              src={CanB1} // Replace with a relevant herbal image
              alt="Natural Healing"
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">Natural Healing</h3>
            <p className="mt-2 text-gray-600">
              Our herbal remedies are designed to restore balance and promote
              natural healing within the body.
            </p>
            <button className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10">
              Explore
            </button>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img
              src={modBack} // Replace with a relevant herbal image
              alt="Holistic Wellness"
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">Holistic Wellness</h3>
            <p className="mt-2 text-gray-600">
              Achieve overall well-being through a combination of ancient herbal
              knowledge and modern science.
            </p>
            <button className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10">
              Explore
            </button>
          </div>
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <img
              src={Effi} // Replace with a relevant herbal image
              alt="Sustainable Health"
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-xl font-semibold">Sustainable Health</h3>
            <p className="mt-2 text-gray-600">
              Our products are crafted from sustainably sourced herbs to ensure
              both your health and the environment's well-being.
            </p>
            <button className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10">
              Explore
            </button>
          </div>
        </div>
      </motion.section>
      {/* Section 3: Benefits */}
      <motion.section
        id="benefits"
        className="py-20 bg-gray-100 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-4xl font-bold mb-12">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            !error &&
            items.map((item) => (
              <div key={item._id} className="bg-white p-6 shadow-lg rounded-lg">
                <img
                  src={item.imageURL} // Ensure your API returns image URLs or handle image URLs appropriately
                  alt={item.name} // Replace with relevant alt text
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="mt-4 text-xl font-semibold">{item.itemName}</h3>
                <p className="mt-2 text-gray-600">
                  {item.description} {/* Display a brief description */}
                </p>
                <button className="bg-lime-500 text-black text-xl px-4 py-2 rounded-md mt-5 mb-10">
                  Shop Now
                </button>
              </div>
            ))}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default HomePage;
