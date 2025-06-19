import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { FaBars } from "react-icons/fa";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="transition-all duration-300 md:ml-64">
        <div className="md:hidden flex items-center gap-4 bg-oranges p-4 shadow">
          <button
            onClick={toggleSidebar}
            className="text-primary"
            aria-label="Open sidebar"
          >
            <FaBars size={20} />
          </button>
          <h1 className=" font-marker text-primary text-2xl ">Admin Panel</h1>
        </div>
        <main className="">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
