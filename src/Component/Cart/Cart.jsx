import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrashAlt,
  FaShieldAlt,
  FaTruck,
  FaExchangeAlt,
  FaStore,
  FaCalculator,
  FaTag,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import config from "../../config/index";

export default function Cart() {
  const [CartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = localStorage.getItem("userToken");
  const restockInDays = Math.floor(Math.random() * 8) + 3;
const [removingProductId, setRemovingProductId] = useState(null);

  useEffect(() => {
    if (!userToken) {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(savedCart);
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/basket`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setCartItems(response.data.data);
      } catch (err) {
        setError("Error fetching Cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userToken]);

  // Notify navbar/cart badge on cart items change
  useEffect(() => {
    window.dispatchEvent(new Event("cartUpdated"));
  }, [CartItems]);

 const handleRemoveFromCart = async (productId) => {
  setRemovingProductId(productId);
  if (userToken) {
    try {
      await axios.delete(`${config.API_URL}/basket`, {
        headers: { Authorization: `Bearer ${userToken}` },
        data: { productId },
      });

      setCartItems((prevItems) => {
        const updated = prevItems.filter((item) => item.product.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updated));
        return updated;
      });

      toast.success("Removed from cart");
    } catch {
      setError("Error removing item from Cart.");
      toast.error("Failed to remove from cart");
    }
  } else {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.product.id !== productId);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    toast.success("Removed from cart");
  }
  setRemovingProductId(null);
};


 const handleQuantityChange = (productId, increment) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + increment;
          const newStock = item.product.stock - increment;

          if (newQuantity >= 1 && newStock >= 0) {
            return {
              ...item,
              quantity: newQuantity,
              product: {
                ...item.product,
                stock: newStock,
              },
            };
          }
        }
        return item;
      });

      if (!userToken) {
        localStorage.setItem("cart", JSON.stringify(updatedItems));
      }

      return updatedItems;
    });
  };
   if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-cream ">
        <div className="flex space-x-2 mb-4">
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-orange-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-oranges text-lg animate-pulse">
          Loading Cart...
        </p>
      </div>
    );
  }
  if (error) return <div className="text-red-500">{error}</div>;

  return (

<div className=" min-h-screen bg-cream mx-auto p-8 sm:px-6 lg:px-12 xl:px-20 2xl:px-32 flex flex-col lg:flex-row gap-10">
  {/* Left Column */}
  <div className="w-full lg:w-3/4 pt-10">
    <h1 className="font-bold text-2xl sm:text-3xl mb-6 text-oranges font-marker">
      Your Cart
    </h1>

    {CartItems.length > 0 ? (
      <ul className="space-y-8">
        {CartItems.map((item) => {
          const product = item.product;
          const rating = Math.round(product.rating || 0);

          return (
            <li
              key={item.id}
              className="relative flex flex-col lg:flex-row gap-6 p-4 sm:p-6 bg-cream shadow-xl rounded-3xl hover:shadow-2xl hover:scale-[1.01] transition-transform"
            >
              {/* Discount Badge - Top Right of Card */}
        <span className="absolute top-5 left-3 bg-gradient-to-r from-oranges to-peach text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce z-10">
          {product.discountPercentage}% OFF
        </span>
              {/* Product Image */}
              <div className="relative w-full sm:w-64 mx-auto lg:mx-0">
            <Link to={`/productsdetails/${product.id}`}>
                <img
                  className="w-full h-52 sm:h-64 object-contain transform transition-transform duration-500"
                  src={`${config.API_URL}${product.thumbnail}`}
                  alt={product.name}
                />
              </Link>

              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-oranges font-marker line-clamp-2">{product.title}</h1>
                <p className="text-peach text-base line-clamp-4 mt-2">{product.description}</p>

                <div className="space-y-2 text-sm mt-4">
                  <div className="flex items-center">
                    <FaStore className="mr-2 text-primary" />
                    <span className="text-primary">{product.brand}</span>
                  </div>
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2 text-oranges" />
                    <span className="text-peach">{product.warrantyInformation}</span>
                  </div>
                  <div className="flex items-center">
                    <FaTruck className="mr-2 text-primary" />
                    <span className="text-primary">{product.shippingInformation}</span>
                  </div>
                  <div className="flex items-center">
                    <FaExchangeAlt className="mr-2 text-oranges" />
                    <span className="text-peach">{product.returnPolicy}</span>
                  </div>
                </div>

                {/* Stock & Ratings */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-5 h-5 ${
                          index < rating ? "text-oranges animate-star-fill" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                    <span className="text-sm font-medium text-peach ml-2">{product.rating}</span>
                  </div>

                  <div>
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
                      <span className="px-3 py-1 text-xs font-semibold rounded-full shadow-md uppercase font-mono bg-[#FF7601] text-white animate-pulse">
                        {product.stock} Left – Hurry!
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md font-mono bg-[#00809D]">
                        {product.stock} In Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Badges */}
                {product.stock < 15 && (
                  <div className="relative flex flex-wrap my-2 gap-2">
                    <div className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow bg-oranges text-white animate-badge-a">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
                      </svg>
                      <span>Best Seller</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow bg-[#00809D] text-white animate-badge-b">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 3h13v13H3V3zm13 0h5l-1.5 5h-3.5V3zm-5 13a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                      </svg>
                      <span>Free Delivery</span>
                    </div>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center mt-3 space-x-4">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="bg-cream text-peach px-3 drop-shadow-lg py-1 rounded-full transition disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="font-medium text-oranges text-lg">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="bg-cream text-oranges drop-shadow-lg px-3 py-1 rounded-full transition disabled:opacity-50"
                    disabled={product.stock <= 0}
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
  onClick={() => handleRemoveFromCart(product.id)}
  className="mt-6 w-full py-3 bg-oranges text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
  disabled={removingProductId === product.id}
>
  {removingProductId === product.id ? (
    <svg
      className="animate-spin h-5 w-5 mr-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  ) : (
    <FaTrashAlt className="mr-2" />
  )}
  {removingProductId === product.id ? "Removing..." : "Remove From Cart"}
</button>

              </div>

              {/* Pricing */}
              <div className="flex justify-between lg:justify-end items-end lg:flex-col gap-2">
                <span className="text-3xl font-extrabold text-[#00809D]">
                  {(product.price * 10).toFixed(2)}L.E
                </span>
                <span className="text-sm text-[#FF7601] line-through strike-loop">
                  {(product.price * 10 + product.discountPercentage).toFixed(2)}L.E
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="flex flex-col items-center justify-center w-full h-3/4 py-20  text-center bg-cream rounded-3xl shadow-lg">
        <FaShoppingCart className="text-6xl text-oranges mb-4 animate-bounce" />
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
          Your Cart is Empty!
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

  {/* Right Column - Totals */}
  <div className="w-full lg:w-1/4 lg:mt-20 h-fit bg-crem p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
    <h2 className="font-extrabold text-2xl text-oranges font-marker mb-6 text-center">
      Cart Summary
    </h2>

    <div className="space-y-6 text-sm">
      <div className="flex justify-between items-center border-b pb-4 hover:translate-x-2 transition-all duration-300">
        <span className="font-medium text-primary flex items-center">
          <FaShoppingCart className="mr-2 text-primary" />
          Total Items:
        </span>
        <span className="font-semibold text-primary">{CartItems.length}</span>
      </div>

      <div className="flex justify-between items-center border-b pb-4 hover:translate-x-2 transition-all duration-300">
        <span className="font-medium flex items-center text-primary">
          <FaDollarSign className="mr-2 text-primary" />
          Subtotal:
        </span>
        <span className="font-semibold text-primary">
          {CartItems.reduce((acc, item) => acc + item.product.price * 2 * item.quantity, 0).toFixed(2)}L.E
        </span>
      </div>

      <div className="flex justify-between items-center border-b pb-4 text-oranges hover:translate-x-2 transition-all duration-300">
        <span className="font-medium text-primary flex items-center">
          <FaTag className="mr-2 text-primary" />
          Discount:
        </span>
        <span className="font-semibold text-primary">
          -{CartItems.reduce((acc, item) => acc + item.product.discountPercentage * item.quantity, 0).toFixed(2)}L.E
        </span>
      </div>

      <div className="flex justify-between items-center font-bold text-lg pt-4 border-t hover:translate-x-2 transition-all duration-300">
        <span className="flex items-center text-oranges">
          <FaCalculator className="mr-2 text-oranges" />
          Total:
        </span>
        <span className="text-oranges">
          {CartItems.reduce((acc, item) => (acc + (item.product.price * 2 - item.product.discountPercentage) * item.quantity), 0).toFixed(2)}L.E
        </span>
      </div>
    </div>

    <button className="mt-6 w-full py-3 bg-oranges text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
      <FaShoppingCart className="mr-2" />
      <span> Checkout</span>
    </button>
  </div>
</div>


  );
}
