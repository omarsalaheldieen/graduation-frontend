import { useState } from "react";
import { Outlet } from "react-router-dom";
import ManBar from "../Manger_bar/Manger_bar";
import { FaBars } from "react-icons/fa";

export default function DashboardLayout() {
  const [isManBarOpen, setIsManBarOpen] = useState(false);
  const toggleManbar = () => setIsManBarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100">
      <ManBar isOpen={isManBarOpen} toggleManbar ={toggleManbar } />
      <div className="transition-all duration-300 md:ml-64">
        <div className="md:hidden flex items-center gap-4 bg-oranges p-4 shadow">
          <button
            onClick={toggleManbar}
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
