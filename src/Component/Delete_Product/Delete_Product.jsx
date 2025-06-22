import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaTrash, FaStar, FaTruck, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import config from "../../config/index";

export default function Delete_Product() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Debounce search input to avoid too frequent filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products on mount
  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);
        const response = await axios.get(`${config.API_URL}/products`);
        setProducts(response?.data?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getProducts();
  }, []);

  // Filter products based on debounced search term
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm) return products;
    return products.filter((p) =>
      p.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [products, debouncedSearchTerm]);

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("userToken");

    try {
      setDeletingProductId(productId);
      await axios.delete(`${config.API_URL}/products/deleteProduct`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: productId },
      });

      setProducts((prev) => prev.filter((p) => p.id !== productId));

      Swal.fire({
        icon: "success",
        title: "Product Deleted!",
        html: "<strong style='color:#FF7601;'>Your product has been deleted successfully.</strong>",
        background: "#FCECDD",
        color: "#FF7601",
        confirmButtonText: "Awesome",
        confirmButtonColor: "#FF7601",
        customClass: {
          icon: "swal-success-orange",
          popup: "rounded-xl shadow-lg px-6 py-8",
          title: "text-2xl font-bold font-marker",
          confirmButton: "text-white px-6 py-2 text-lg rounded-full",
        },
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        html: "<strong style='color:#FF7601;'>Failed to delete product. Please try again.</strong>",
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
    } finally {
      setDeletingProductId(null);
    }
  };

  const restockInDays = Math.floor(Math.random() * 8) + 3;

  return (
     <div className="relative bg-cream">
  {isLoading && (
    <div className="absolute inset-0 flex flex-col justify-center items-center z-40 bg-cream/80 backdrop-blur-sm rounded-xl">
      <div className="flex space-x-2 mb-4">
        <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-orange-600 rounded-full animate-bounce"></div>
      </div>
      <p className="text-oranges text-lg animate-pulse">Loading products...</p>
    </div>
  )}
  
       
    <div className="px-4 py-8 md:px-10  min-h-screen bg-cream">
      <h1 className="font-marker text-center text-oranges my-4 text-4xl">Delete Product </h1>
       {/* Animated Search Bar */}
        <motion.div
          initial={{ width: 200, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="hidden xl:flex flex-grow max-w-xl mx-auto  my-8"
        >
          <div className="relative w-full group">
            <motion.input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 0 4px rgba(0, 128, 157, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="w-full py-2.5 pl-12 pr-4 rounded-full border border-oranges bg-cream text-primary placeholder-oranges focus:outline-none focus:border-primary transition-all duration-300"
            />
            <motion.div
              animate={{ x: [0, -1.5, 1.5, -1.5, 1.5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              className="absolute left-4 top-3 text-oranges"
            >
              <FaSearch />
            </motion.div>
          </div>
        </motion.div>
      <div className="product-grid  grid grid-cols bg-cream  d-flex justify-center  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:p-28">
        
        {products.map((product) => (
             <div className="relative group p-4 animate-fade-in-up">
           <div className="max-w-sm bg-cream border border-cream rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03]">
             <div className="relative">
             <Link to={`/productsdetails/${product.id}`}>
                 <div className="w-full h-64 bg-cream flex items-center justify-center overflow-hidden">
                   <img
                     className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  src={`${config.API_URL}${product.thumbnail}`}
                     alt={product.title}
                   />
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-30 transition-opacity"></div>
                 </div>
               </Link>
         
               <span className="absolute top-3 left-3 bg-gradient-to-r from-oranges to-peach text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                 {product.discountPercentage}% OFF
               </span>
         
               {/* Badges */}
               <div className="absolute bottom-3 left-3 z-10 w-fit">
                 {product.stock < 15 && product.stock > 0 && (
                   <>
                     <div className="absolute animate-badge-a flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow bg-oranges text-white">
                       <FaStar className="text-white" /> Best Seller
                     </div>
                     <div className="animate-badge-b flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow bg-primary text-white">
                       <FaTruck className="text-white" /> Free Delivery
                     </div>
                   </>
                 )}
               </div>
         
               <button
                  className="absolute top-4 right-4 p-2 text-oranges transition-all duration-300 transform hover:scale-125"
                  aria-label="Delete Product"
                  onClick={() => handleDelete(product.id)}
                >
                 {deletingProductId === product.id ? (
  <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
) : (
  <FaTrash className="w-6 h-6" />
)}

                </button>
             </div>
         
             {/* Product Info */}
             <div className="p-5">
               <Link to={`productsdetails/${product.id}`}>
                 <h5 className="text-xl font-bold font-marker text-oranges truncate">
                   {product.title}
                 </h5>
               </Link>
               <p className="text-peach text-sm mt-2 mb-4 line-clamp-2">
                 {product.description}
               </p>
         
               <div className="flex items-center justify-between flex-wrap gap-2">
                 <div className="flex items-center">
                   {[...Array(5)].map((_, index) => (
                     <svg
                       key={index}
                       className={`w-5 h-5 ${
                         index < Math.round(product.rating)
                           ? "text-oranges animate-star-fill"
                           : "text-peach"
                       }`}
                       fill="currentColor"
                       viewBox="0 0 22 20"
                     >
                       <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                     </svg>
                   ))}
                   <p className="ps-2 font-medium text-peach">{product.rating}</p>
                 </div>
         
                 {/* Stock */}
                 <div className="flex gap-2 items-center">
                   {product.stock === 0 ? (
                     <>
                       <span className="absolute px-3 py-1 text-xs font-semibold text-white bg-oranges rounded-full shadow-md uppercase animate-badge-a">
                         Out of Stock
                       </span>
                       {restockInDays && (
                         <span className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full shadow-md animate-badge-b">
                           Restock in {restockInDays} days
                         </span>
                       )}
                     </>
                   ) : product.stock < 6 ? (
                     <span className="px-3 py-1 text-xs font-semibold rounded-full shadow-md tracking-wide uppercase font-mono bg-oranges text-white animate-pulse">
                       {product.stock} Left – Hurry!
                     </span>
                   ) : (
                     <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md tracking-wide uppercase font-mono bg-primary">
                       {product.stock} In Stock
                     </span>
                   )}
                 </div>
               </div>
         
               {/* Price */}
               <div className="mt-4 mb-4 flex items-center gap-3">
                 <span className="text-3xl font-extrabold text-primary">
                   {(product.price * 20).toFixed(2)}L.E
                 </span>
                 <span className="text-sm text-peach  strike-loop">
                   {(product.price * 2 + product.discountPercentage).toFixed(2)}L.E
                 </span>
               </div>
             </div>
           </div>
         </div>
        ))}
      </div>
    </div>
    </div>
  );
}
