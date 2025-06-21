import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaStar, FaTruck } from "react-icons/fa";
import config from "../../config";

export default function Men() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const restockInDays = Math.floor(Math.random() * 8) + 3;
  const userToken = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: config.API_URL,
    headers: { Authorization: `Bearer ${userToken}` },
  });

  const getLocalStorageArray = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  };

  const fetchAllMenProducts = async () => {
    const categories = ["mens-shirts", "sunglasses", "mens-shoes", "mens-watches"];
    try {
      const promises = categories.map((cat) =>
        axios.get(`${config.API_URL}/products/category/${cat}`)
      );
      const results = await Promise.all(promises);
      const all = results.flatMap((res) => res.data.data);
      setProducts(all);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishlistAndCart = async () => {
    try {
      const wishlistIds = getLocalStorageArray("wishlist").map(Number);
      const cartIds = getLocalStorageArray("cart").map(Number);

      if (userToken) {
        const wishlistRes = await axiosInstance.get("/wishlist");
        const cartRes = await axiosInstance.get("/basket");

        setWishlist(wishlistRes.data.data.map((item) => item.product.id));
        setCart(cartRes.data.data.map((item) => item.product.id));
      } else {
        setWishlist(wishlistIds);
        setCart(cartIds);
      }
    } catch (err) {
      console.error("Failed to load wishlist/cart", err);
    }
  };

  const addToWishlist = async (product) => {
    if (!userToken || !userId) return navigate("/login");
    try {
      let updated = [...wishlist];
      if (wishlist.includes(product.id)) {
        await axiosInstance.delete("/wishlist", {
          data: { productId: product.id, userId },
        });
        updated = updated.filter((id) => id !== product.id);
        toast.success("Removed from Wishlist ");
      } else {
        await axiosInstance.post("/wishlist", {
          productId: product.id,
          userId,
        });
        updated.push(product.id);
        toast.success("Added to Wishlist ");
      }
      setWishlist(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      toast.error("Failed to update wishlist.");
    }
  };

  const addToCart = async (product) => {
    if (!userToken || !userId) return navigate("/login");
    try {
      let updated = [...cart];
      if (cart.includes(product.id)) {
        await axiosInstance.delete("/basket", {
          data: { productId: product.id, userId },
        });
        updated = updated.filter((id) => id !== product.id);
        toast.success("Removed from Cart ");
      } else {
        await axiosInstance.post("/basket", {
          productId: product.id,
          userId,
        });
        updated.push(product.id);
        toast.success("Added to Cart ");
      }
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error("Failed to update cart.");
    }
  };

  useEffect(() => {
    fetchWishlistAndCart();
    fetchAllMenProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-cream ">
        <div className="flex space-x-2 mb-4">
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-orange-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-oranges text-lg animate-pulse">
          Loading  Men products...
        </p>
      </div>
    );
  }

  return (
    <div className="p-16 bg-cream">
      <h1 className="font-bold text-2xl sm:text-3xl mb-6 text-oranges font-marker text-center">Men Products</h1>
      {error && <div className="error">{error}</div>}
      <div className="product-grid grid grid-cols bg-cream d-flex justify-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-28">
        {products.map((product) => {
          const isWishlisted = wishlist.includes(product.id);
          const isCarted = cart.includes(product.id);

          return (
            <div className="relative group p-4 animate-fade-in-up" key={product.id}>
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

                  {/* Wishlist */}
                  <button
                    onClick={() => addToWishlist(product)}
                    className="absolute top-3 right-3 p-2 transition-transform duration-300 hover:scale-110"
                    aria-label="Toggle wishlist"
                  >
                    <svg
                      className={`w-6 h-6 ${isWishlisted ? "text-oranges" : "text-[#FF7601]"}`}
                      fill={isWishlisted ? "#FF7601" : "none"}
                      stroke={isWishlisted ? "#FF7601" : "#FF7601"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>

                  {/* Cart */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`absolute top-10 right-3 p-2 transition-transform duration-300 hover:scale-110 ${product.stock === 0 ? "cursor-not-allowed opacity-50" : ""}`}
                    aria-label="Add to cart"
                  >
                    <svg
                      className={`w-6 h-8 ${isCarted ? "text-primary" : "text-[#00809D]"}`}
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
                  <Link to={`/productsdetails/${product.id}`}>
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
                          className={`w-5 h-5 ${index < Math.round(product.rating) ? "text-oranges animate-star-fill" : "text-peach"}`}
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
                    <span className="text-3xl font-extrabold text-primary">
                      ${(product.price * 10).toFixed(2)}
                    </span>
                    <span className="text-sm text-peach strike-loop">
                      ${(product.price * 10 + product.discountPercentage).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
