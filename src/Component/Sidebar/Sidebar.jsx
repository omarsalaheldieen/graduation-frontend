import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTimes, FaUserCog, FaSignOutAlt, FaBox } from "react-icons/fa";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const NavItem = ({ to, icon, label }) => {
    const handleClick = (e) => {
      if (window.innerWidth < 768) {
        e.preventDefault();
        toggleSidebar();
        setTimeout(() => navigate(to), 200);
      }
    };

    return (
      <Link
        to={to}
        onClick={handleClick}
        className={`group flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
          isActive(to)
            ? "bg-peach text-white shadow-md"
            : "hover:bg-oranges/80"
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span className="text-white font-semibold tracking-wide transition-opacity duration-200 group-hover:opacity-100">
          {label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-oranges text-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-oranges">
          <span className="text-2xl font-bold tracking-wider font-marker  text-primary">Admin Panel</span>
          <button
            onClick={toggleSidebar}
            className="text-primary md:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes className="text-primary" size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-3 overflow-y-auto  h-[calc(100vh-80px)]">
          <NavItem to="/dashboard" icon={<FaUserCog />} label="Dashboard" className="text-primary" />
          <NavItem to="/dashboard/admin" icon={<FaUserCog />} label="Users" />
          <NavItem to="/dashboard/product_man" icon={<FaBox />} label="Add Products" />
          <NavItem to="/dashboard/delete_Product" icon={<FaBox />} label="Delete Products" />
          <NavItem to="/dashboard/update_Product" icon={<FaBox />} label="Update Products" />

          <div className="mt-8 pt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-3 bg-oranges hover:bg-peach text-white rounded-xl transition-all duration-300"
            >
              <FaSignOutAlt />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
