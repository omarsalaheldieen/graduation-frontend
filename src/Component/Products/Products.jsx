import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaStar, FaTruck } from "react-icons/fa";
import config from "../../config";

function ProductCard({ product, wishlist = [], cart = [] }) {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCarted, setIsCarted] = useState(false);
  const [restockInDays, setRestockInDays] = useState(null);

  useEffect(() => {
    setIsWishlisted(wishlist.includes(Number(product.id)));
    setIsCarted(cart.includes(Number(product.id)));
  }, [wishlist, cart, product.id]);

  useEffect(() => {
    if (product.stock === 0) {
      setRestockInDays(Math.floor(Math.random() * 8) + 3);
    }
  }, [product.stock]);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: config.API_URL,
      headers: { Authorization: `Bearer ${userToken}` },
    });
  }, [userToken]);

  const updateLocalStorageList = (key, id, add) => {
    let items = JSON.parse(localStorage.getItem(key) || "[]");
    if (add) {
      if (!items.includes(id)) items.push(id);
    } else {
      items = items.filter((item) => item !== id);
    }
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event(`${key}Updated`));
  };

  const handleWishlist = async () => {
    if (!userToken || !userId) return navigate("/login");
    try {
      if (isWishlisted) {
        await axiosInstance.delete("/wishlist", { data: { productId: product.id, userId } });
        setIsWishlisted(false);
        updateLocalStorageList("wishlist", Number(product.id), false);
        toast.success("Removed from Wishlist");
      } else {
        await axiosInstance.post("/wishlist", { productId: product.id, userId });
        setIsWishlisted(true);
        updateLocalStorageList("wishlist", Number(product.id), true);
        toast.success("Added to Wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Wishlist update failed");
    }
  };

  const handleCart = async () => {
    if (!userToken || !userId) return navigate("/login");
    try {
      if (isCarted) {
        await axiosInstance.delete("/basket", { data: { productId: product.id, userId } });
        setIsCarted(false);
        updateLocalStorageList("cart", Number(product.id), false);
        toast.success("Removed from Cart");
      } else {
        await axiosInstance.post("/basket", { productId: product.id, userId });
        setIsCarted(true);
        updateLocalStorageList("cart", Number(product.id), true);
        toast.success("Added to Cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Cart update failed");
    }
  };

  return (
    <div className="relative group p-4 animate-fade-in-up">
      <div className="max-w-sm bg-cream border border-cream rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03]">
        <div className="relative">
          <Link to={`productsdetails/${product.id}`}>
            <div className="w-full h-64 bg-cream flex items-center justify-center overflow-hidden">
              <img
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                src={`${config.API_URL}/${product.thumbnail}`}
                alt={product.title}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </div>
          </Link>

          <span className="absolute top-3 left-3 bg-gradient-to-r from-oranges to-peach text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
            {product.discountPercentage}% OFF
          </span>

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
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 transition-transform duration-300 hover:scale-110"
            aria-label="Toggle wishlist"
          >
            <svg
              className={`w-6 h-6 ${isWishlisted ? "text-oranges" : "text-[#FF7601]"}`}
              viewBox="0 0 24 24"
              fill={isWishlisted ? "#FF7601" : "none"}
              stroke="#FF7601"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 
                  2.09C13.09 3.81 14.76 3 16.5 3 
                  19.58 3 22 5.42 22 8.5c0 
                  3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          <button
            onClick={handleCart}
            disabled={product.stock === 0}
            className={`absolute top-10 right-3 p-2 transition-transform duration-300 hover:scale-110 ${
              product.stock === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
            aria-label="Add to cart"
          >
            <svg
              className={`w-6 h-8 ${isCarted ? "text-primary" : "text-[#00809D]"}`}
              viewBox="0 0 24 24"
              fill={isCarted ? "#00809D" : "none"}
              stroke="#00809D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.2 2.3A1 1 0 0 0 5 3v1a1 1 0 0 0 1 1h1l2.68 9.38a1 1 0 0 0 .95.72H18a1 1 0 0 0 .95-.68l3-8a1 1 0 0 0-.94-1.32H7.42L6.2 2.3Z" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          <Link to={`productsdetails/${product.id}`}>
            <h5 className="text-xl font-bold font-marker text-oranges truncate">{product.title}</h5>
          </Link>
          <p className="text-peach text-sm mt-2 mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.rating) ? "text-oranges animate-star-fill" : "text-peach"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
              ))}
              <p className="ps-2 font-medium text-peach">{product.rating}</p>
            </div>

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

          <div className="mt-4 mb-4 flex items-center gap-3">
            <span className="text-3xl font-extrabold text-primary">{(product.price * 10).toFixed(2)}L.E</span>
            <span className="text-sm text-peach strike-loop">
              {(product.price * 10 + product.discountPercentage).toFixed(2)}L.E
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);
