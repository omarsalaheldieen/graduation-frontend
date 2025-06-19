import React, { useContext, useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { motion } from "framer-motion";

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { userToken, userName, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef();

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const name = localStorage.getItem("userName");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const safeJsonParse = (value, fallback = []) => {
      try {
        return JSON.parse(value) || fallback;
      } catch {
        return fallback;
      }
    };

    const updateWishlistCount = async () => {
      if (!userToken) {
        const localWishlist = safeJsonParse(localStorage.getItem("wishlist"));
        setWishlistCount(localWishlist.length);
        return;
      }

      try {
        const response = await axios.get(`${config.API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setWishlistCount(response.data.data.length);
      } catch {
        setWishlistCount(0);
      }
    };

    updateWishlistCount();
    const handleUpdate = () => updateWishlistCount();
    const handleStorage = (e) => e.key === "wishlist" && updateWishlistCount();

    window.addEventListener("wishlistUpdated", handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("wishlistUpdated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [userToken]);

  useEffect(() => {
    const updateCart = async () => {
      if (!userToken) {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(savedCart);
        setLoading(false);
      } else {
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
      }
    };

    const handleCartUpdated = () => updateCart();
    const handleStorage = (e) => e.key === "cart" && updateCart();

    updateCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, [userToken]);

  useEffect(() => {
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  const renderBadge = (count) => {
    const validCount = Number(count);
    return validCount > 0 ? (
      <span className="absolute -top-2 -right-3 bg-primary text-white text-[0.7rem] rounded-full min-w-[1.5rem] h-6 flex items-center justify-center px-1 shadow-md">
        {validCount}
      </span>
    ) : null;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-cream shadow-lg font-sans">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logho.png"
            alt="logo"
            className="h-10 w-10 xl:h-10 xl:w-10  animate-float"
          />
          <span className=" text-3xl font-marker tracking-wide text-oranges">
            BAZZZZAR
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-md hover:scale-105 duration-200"
        >
          {mobileMenuOpen ? (
            <FaTimes className="text-3xl text-oranges" />
          ) : (
            <FaBars className="text-3xl text-oranges" />
          )}
        </button>

        {!isAuthPage && userRole !== "admin" && userRole !== "manger" && (
          <motion.div
            initial={{ width: 200, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="hidden xl:flex flex-grow max-w-xl mx-8"
          >
            <div className="relative w-full group">
              <motion.input
                type="text"
                value={debouncedSearchTerm}
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
        )}

        <div className="hidden xl:flex items-center space-x-8 text-primary font-semibold">
         {!isAuthPage && ( <div
            className="relative flex items-center space-x-2 cursor-pointer"
            ref={profileRef}
          >
            <div
              onClick={() => setProfileDropdownOpen((v) => !v)}
              className="bg-peach rounded-full w-9 h-9 flex items-center justify-center text-white font-bold shadow-md"
              title={name || "Profile"}
            >
              {name ? (
                name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              ) : (
                <FaUser />
              )}
            </div>
            <span className="text-oranges truncate max-w-[100px]">
              {name ? `Hi, ${name}` : "Profile"}
            </span>

            {profileDropdownOpen && (
              <div className="absolute left-0 top-12 bg-cream rounded-md shadow-lg py-2 w-40 text-oranges animate-[scale-fade_300ms_ease-out_forwards]">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:scale-105 duration-200"
                >
                  My Profile
                </Link>
                {!isAuthPage && userToken && userToken.trim() !== "" ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:scale-105 duration-200"
                  >
                    Log Out
                  </button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/login"
                      className="w-full text-left px-4 py-2 hover:scale-105 duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="w-full text-left px-4 py-2 hover:scale-105 duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>)}

          {!isAuthPage && userRole !== "admin" && userRole !== "manger" && (
            <>
              <NavLink
                to="/cart"
                className="relative hover:text-oranges text-oranges transition-transform transform hover:scale-110 duration-200"
              >
                <FaShoppingCart className="text-2xl" />
                {renderBadge(cartItems.length)}
              </NavLink>

              <NavLink
                to="/wishlist"
                className="relative hover:text-oranges text-oranges transition-transform transform hover:scale-110 duration-200"
              >
                <FaHeart className="text-2xl" />
                {renderBadge(wishlistCount)}
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div
        className={`xl:hidden px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-screen opacity-100 py-6 space-y-4"
            : "max-h-0 opacity-0"
        } bg-cream shadow-lg rounded-b-lg`}
      >
        {!isAuthPage && (
          <div className="relative">
            <input
              type="text"
              value={debouncedSearchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 text-sm pl-5 pr-12 rounded-full bg-white text-primary placeholder-oranges focus:ring-2 focus:ring-primary"
            />
            <FaSearch className="absolute right-4 top-2.5 text-oranges" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Link to="/profile">
            <button className="w-full  bg-oranges hover:bg-oranges px-4 py-3 rounded-full text-white font-semibold flex items-center justify-center space-x-2">
              <FaUser className="text-lg" />
              <span>{userName ? `Hi! ${userName}` : "Profile"}</span>
            </button>
          </Link>

          {!isAuthPage && userToken && (
            <button
              onClick={handleLogout}
              className="w-full  bg-oranges hover:bg-oranges text-white px-4 py-3 rounded-full text-sm font-semibold flex items-center justify-center space-x-2"
            >
              <span>Log Out</span>
            </button>
          )}

          {!isAuthPage && userRole !== "admin" && (
            <>
              <NavLink to="/cart" className="relative w-full">
                <button className="w-full bg-oranges hover:bg-oranges  text-white font-semibold px-4 py-2 rounded-full flex items-center justify-center space-x-2 border border-oranges">
                  <FaShoppingCart className="text-lg" />
                  <span>Cart</span>
                  {renderBadge(cartItems.length)}
                </button>
              </NavLink>

              <NavLink to="/wishlist" className="relative w-full">
                <button className="w-full bg-oranges hover:bg-oranges  text-white  font-semibold px-4 py-2 rounded-full flex items-center justify-center space-x-2 border border-oranges">
                  <FaHeart className="text-lg" />
                  <span>Wishlist</span>
                  {renderBadge(wishlistCount)}
                </button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
