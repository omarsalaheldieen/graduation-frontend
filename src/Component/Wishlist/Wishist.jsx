import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaStore,
  FaStar,
  FaTruck,
} from "react-icons/fa";

const safeJsonParse = (value, fallback = []) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

export default function Wishlist({ product, cart = [] }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localCart, setLocalCart] = useState([]);
  const navigate = useNavigate();
  const restockInDays = Math.floor(Math.random() * 8) + 3;
  const userToken = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userToken) {
      const savedWishlist = safeJsonParse(localStorage.getItem("wishlist"));
      setWishlistItems(savedWishlist);
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:8080/wishlist", {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setWishlistItems(response.data.data);
      } catch {
        setError("Error fetching wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userToken]);

  useEffect(() => {
    const updateCart = () => {
      const storedCart = safeJsonParse(localStorage.getItem("cart"));
      setLocalCart(storedCart);
    };

    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      let updatedWishlist = [];

      if (userToken) {
        await axios.delete("http://localhost:8080/wishlist", {
          headers: { Authorization: `Bearer ${userToken}` },
          data: { productId },
        });

        updatedWishlist = wishlistItems.filter(
          (item) => item.product?.id !== productId
        );
      } else {
        updatedWishlist = wishlistItems.filter((item) => item?.id !== productId);
      }

      setWishlistItems(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success("Removed from wishlist");
    } catch {
      setError("Error removing item from wishlist.");
      toast.error("Failed to remove from wishlist");
    }
  };

  const addToCart = async (product) => {
    if (!userToken || !userId) {
      navigate("/login");
      return;
    }

    const axiosInstance = axios.create({
      baseURL: "http://localhost:8080",
      headers: { Authorization: `Bearer ${userToken}` },
    });

    try {
      let updatedCart = [...localCart];
      if (updatedCart.includes(Number(product.id))) {
        await axiosInstance.delete("/basket", {
          data: { productId: product.id, userId },
        });
        updatedCart = updatedCart.filter((id) => id !== Number(product.id));
        toast.success("Removed from cart");
      } else {
        await axiosInstance.post("/basket", {
          productId: product.id,
          userId,
        });
        updatedCart.push(Number(product.id));
        toast.success("Added to cart");
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setLocalCart(updatedCart);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Cart error:", error.response || error.message);
      toast.error("Cart operation failed");
    }
  };

  const wishlistCount = wishlistItems.length;
  const cartCount = localCart.length;

   if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-cream bg-opacity-80">
        <div className="flex space-x-2 mb-4">
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-orange-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-oranges text-lg animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className=" min-h-screen bg-cream mx-auto p-8 sm:px-6 lg:px-12 xl:px-20 2xl:px-32 flex flex-col lg:flex-row gap-10">
    <div className="w-full lg:w-3/4 pt-10">
      <h1 className="text-3xl font-bold text-oranges  ps-6 font-marker mb-6">Your Wishlist</h1>

      {wishlistItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="grid  justify-center sm:grid-cols lg:grid-cols-2 xl:grid-cols-3 gap-2 flex-1">
            {wishlistItems.map((item) => {
              const product = item?.product;
              if (!product) return null;

              const imageUrl = `http://localhost:8080${product?.images?.[0] || product?.thumbnail}`;
             const isCarted = localCart.includes(Number(product?.id));


              return (
                <div key={product.id} className="relative group  animate-fade-in-up">
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
                  
                        {/* Wishlist */}
                          <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-4 right-4 p-2 text-oranges  transition-all duration-300 transform hover:scale-125"
                        aria-label="Remove from Wishlist"
                      >
                        <FaTrash className="w-6 h-6" />
                      </button>

                      <button
                        onClick={() => addToCart(product)}
                        className="absolute bottom-3 right-3 p-2 transition-transform duration-300 hover:scale-110"
                        aria-label="Toggle cart"
                      >
                        <svg
                        className={`w-6 h-8 transition-colors duration-300 ${
  isCarted ? "text-primary animate-pulse" : "text-[#00809D]"
}`}
                          viewBox="0 0 24 24"
                          fill={isCarted ? "#00809D" : "none"}
                          stroke={isCarted ? "#00809D" : "#00809D"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.2 2.3A1 1 0 0 0 5 3v1a1 1 0 0 0 1 1h1l2.68 9.38a1 1 0 0 0 .95.72H18a1 1 0 0 0 .95-.68l3-8a1 1 0 0 0-.94-1.32H7.42L6.2 2.3Z" />
                        </svg>
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
                </div>
              );
            })}
          </div>

         
        </div>
      ) : (
       <div className="flex flex-col items-center justify-center w-full h-3/4 py-20  text-center bg-cream rounded-3xl shadow-lg">
               <FaHeart className="text-6xl text-oranges mb-4 animate-bounce" />
               <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                 Your Wishlist is Empty!
               </h2>
               <p className="text-base sm:text-lg text-oranges mb-6">
                 It seems like you haven’t added any products yet. Start shopping now!
               </p>
               <button
                 className="mt-4 py-3 px-6 bg-oranges text-white font-bold rounded-full shadow-md transform hover:scale-105 transition duration-300"
                 onClick={() => (window.location.href = "/")}
               >
                 <FaStore className="mr-2 inline-block" />
                 Go to Shop
               </button>
             </div>
      )}
    </div>
     <div className="w-full lg:w-1/4 lg:mt-20 h-fit bg-crem p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="font-extrabold text-2xl text-oranges font-marker mb-6 text-center">
              Summary Overview
            </h2>
            <div className="space-y-6 text-sm text-primary">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="font-medium flex items-center text-primary">
                  <FaHeart className="mr-2 text-primary" />
                  Wishlist Items:
                </span>
                <span className="font-semibold text-primary">{wishlistCount}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="font-medium flex items-center text-primary">
                  <FaShoppingCart className="mr-2 text-primary" />
                  Cart Items:
                </span>
                <span className="font-semibold text-primary">{cartCount}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="mt-6 w-full py-3 bg-oranges text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Go to Cart
            </button>
          </div>
          </div>
  );
}
