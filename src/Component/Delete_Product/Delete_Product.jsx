import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaTrash, FaStar, FaTruck  } from "react-icons/fa";
import config from "../../config/index";

export default function Delete_Product() {
  const [products, setProducts] = useState([]);
  const restockInDays = Math.floor(Math.random() * 8) + 3;
  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axios.get("http://localhost:8080/products");
        setProducts(response?.data?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    getProducts();
  }, []);

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("userToken");

    try {
      await axios.delete("http://localhost:8080/products/deleteProduct", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: productId },
      });

      setProducts((prev) => prev.filter((p) => p.id !== productId));

      Swal.fire({
       icon: "success",
       title: " Product Deletedted!",
       html: "<strong style='color:#FF7601;'>Your product has been deleted successfully.</strong>",
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
      const message =
        err.response?.data?.message || "Failed to delete product.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="px-4 py-8 md:px-10 bg-cream">
      <h1 className="font-marker text-center text-oranges my-4 text-4xl">Delete Product </h1>
      <div className="product-grid  grid grid-cols bg-cream  d-flex justify-center  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:p-28">

        {products.map((product) => (
             <div className="relative group p-4 animate-fade-in-up">
           <div className="max-w-sm bg-cream border border-cream rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03]">
             <div className="relative">
             <Link to={`/productsdetails/${product.id}`}>
                 <div className="w-full h-64 bg-cream flex items-center justify-center overflow-hidden">
                   <img
                     className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                     src={`http://localhost:8080${product.thumbnail}`}
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
                  <FaTrash className="w-6 h-6" />
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
                   ${(product.price * 20).toFixed(2)}
                 </span>
                 <span className="text-sm text-peach  strike-loop">
                   ${(product.price * 2 + product.discountPercentage).toFixed(2)}
                 </span>
               </div>
             </div>
           </div>
         </div>
        ))}
      </div>
    </div>
  );
}
