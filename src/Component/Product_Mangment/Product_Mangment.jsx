import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  FaBoxOpen, FaTags, FaDollarSign, FaUpload, FaShippingFast,
  FaInfoCircle, FaCubes, FaRuler, FaBarcode, FaRegCommentDots, FaCheckCircle
} from "react-icons/fa";
import config from "../../config";

const iconMap = {
  title: <FaBoxOpen />, description: <FaInfoCircle />, category: <FaTags />,
  price: <FaDollarSign />, discountPercentage: <FaDollarSign />, rating: <FaCheckCircle />,
  stock: <FaCubes />, tags: <FaTags />, brand: <FaBoxOpen />, sku: <FaBarcode />,
  weight: <FaRuler />, width: <FaRuler />, height: <FaRuler />, depth: <FaRuler />,
  warrantyInformation: <FaInfoCircle />, shippingInformation: <FaShippingFast />,
  availabilityStatus: <FaCheckCircle />, returnPolicy: <FaInfoCircle />,
  minimumOrderQuantity: <FaCubes />, barcode: <FaBarcode />, qrCode: <FaBarcode />,
  reviews: <FaRegCommentDots />
};

export default function ProductManagement() {
  const token = localStorage.getItem("userToken");

  const [formFields, setFormFields] = useState({
    title: "", description: "", category: "", price: "", discountPercentage: "",
    rating: "", stock: "", tags: "", brand: "", sku: "", weight: "", width: "",
    height: "", depth: "", warrantyInformation: "", shippingInformation: "",
    availabilityStatus: "", returnPolicy: "", minimumOrderQuantity: "",
    barcode: "", qrCode: "", reviews: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (thumbnail) formData.append("thumbnail", thumbnail);
    images.forEach((img) => formData.append("images", img));

    if (!token) {
      return Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in first.",
      });
    }

    try {
      await axios.post(`${config.API_URL}/products/addProduct`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

 Swal.fire({
  icon: "success",
  title: " Product Created!",
  html: "<strong style='color:#FF7601;'>Your product has been added successfully.</strong>",
  background: "#FCECDD",
  color: "#FF7601",
  confirmButtonText: "Awesome ",
  confirmButtonColor: "#FF7601",
  customClass: {
    icon: "swal-success-orange",
    popup: "rounded-xl shadow-lg px-6 py-8",
    title: "text-2xl font-bold font-marker",
    confirmButton: "text-white px-6 py-2 text-lg rounded-full",
  },
});

    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      Swal.fire({
  icon: "error",
  title: "Failed!",
  html: "<strong style='color:#FF7601;'>Failed to add product. Please try again.</strong>",
  background: "#FCECDD",
  color: "#FF7601",
  confirmButtonText: "Okay",
  confirmButtonColor: "#FF7601",
  customClass: {
    icon: "swal2-icon-orange",
    popup: "rounded-xl shadow-lg px-6 py-8",
    title: "text-2xl font-bold font-marker",
    confirmButton: "text-white px-6 py-2 text-lg rounded-full",
  },
});

    }
  };

  const sections = [
    {
      title: "Basic Info",
      fields: ["title", "description", "category", "brand", "sku", "tags"],
    },
    {
      title: "Pricing & Stock",
      fields: ["price", "discountPercentage", "rating", "stock"],
    },
    {
      title: "Shipping & Dimensions",
      fields: ["weight", "width", "height", "depth", "shippingInformation", "warrantyInformation"],
    },
    {
      title: "Meta & Returns",
      fields: ["barcode", "qrCode", "returnPolicy", "availabilityStatus", "minimumOrderQuantity", "reviews"],
    },
  ];

  const renderInput = (field) => (
    <motion.div
      key={field}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mb-6"
    >
      <label className="absolute left-3 top-[-10px] bg-cream px-1 text-sm text-oranges font-medium z-10">
        {iconMap[field]} {field.replace(/([A-Z])/g, " $1")}
      </label>
      <input
        name={field}
        type="text"
        value={formFields[field]}
        onChange={handleChange}
        placeholder={`Enter ${field}`}
        className="w-full border border-oranges rounded-[8px] px-4 pt-6 pb-2 text-oranges bg-cream shadow placeholder-peach focus:ring-4 focus:ring-oranges focus:border-oranges focus:outline-none"
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-cream py-10 px-4 font-handwriting">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto bg-cream p-10 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-center items-center gap-4 mb-12">
          <img
            src="/logho.png"
            alt="Logo"
            className="h-10 w-10 xl:h-12 xl:w-12 animate-float"
          />
          <h2 className="text-4xl font-extrabold font-marker text-oranges">
            Add New Product
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          {sections.map((section, index) => (
            <div key={index} className="mb-10">
              <div className="flex items-center text-oranges text-xl font-bold mb-4">
                <span className="text-2xl mr-2">{iconMap[section.fields[0]]}</span>
                {section.title}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map(renderInput)}
              </div>
            </div>
          ))}

          <div className="mb-10">
            <div className="flex items-center text-oranges text-xl font-bold mb-4">
              <FaUpload className="mr-2" />
              Upload Media
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative w-full">
                <label htmlFor="thumbnail-upload" className="text-oranges block mb-1">Thumbnail</label>
                <label
                  htmlFor="thumbnail-upload"
                  className="inline-block bg-oranges text-white font-semibold px-4 py-2 rounded-[8px] cursor-pointer shadow hover:bg-orange-500 transition duration-300"
                >
                  Choose Thumbnail
                </label>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>

              <div className="relative w-full">
                <label htmlFor="file-upload" className="text-oranges block mb-1">Gallery Images</label>
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-oranges text-white font-semibold px-4 py-2 rounded-[8px] cursor-pointer shadow hover:bg-orange-500 transition duration-300"
                >
                  Choose Images
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-oranges hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300"
            >
              🚀 Submit Product
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
