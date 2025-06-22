// Enhanced UsersTable with creative, responsive design
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import {
  FaEdit,
  FaTrashAlt,
  FaTimes,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";
import config from "../../config/index";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [updateData, setUpdateData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await axios.get(`${config.API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    }
  }

  function openDeleteModal(user) {
    setDeletingUser(user);
  }
  function cancelDelete() {
    setDeletingUser(null);
  }

  async function confirmDelete() {
    if (!deletingUser) return;
    try {
      setDeletingId(deletingUser.id);
      await axios.delete(`${config.API_URL}/users/${deletingUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== deletingUser.id));
      toast.success("User deleted");
      setDeletingUser(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  }

  function openEditModal(user) {
    setEditingUser(user);
    setUpdateData({ ...user });
    setErrors({});
  }

  function handleChange(e) {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  }

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().min(3).max(15).required("First name is required"),
    lastname: Yup.string().min(3).max(15).required("Last name is required"),
    age: Yup.number().min(18).max(100).required("Age is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^(01[0-9]{9}|02[0-9]{7})$/, "Invalid phone")
      .required("Phone is required"),
  });

  async function handleUpdate() {
    try {
      await validationSchema.validate(updateData, { abortEarly: false });
      setErrors({});
      await axios.put(
        `${config.API_URL}/users/${editingUser.id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...updateData } : u
        )
      );
      toast.success("User Updated", {
        duration: 3000,
        style: {
          background: "#FCECDD",
          color: "#FF7601",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "18px",
          fontFamily: "Permanent Marker",
        },
      });
      setEditingUser(null);
    } catch (err) {
      if (err.name === "ValidationError") {
        const errorObj = {};
        err.inner.forEach((e) => {
          errorObj[e.path] = e.message;
        });
        setErrors(errorObj);
      } else {
        const message =
          err.response?.data?.message?.includes("email") &&
          err.response.data.message.includes("duplicate")
            ? "Email is already in use by another user"
            : err.response?.data?.message || "Update failed";

        toast.error(message);
      }
    }
  }

  const filteredUsers = users.filter((user) =>
  `${user.firstname} ${user.lastname} ${user.email}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);


  return (
    <div className="p-4 sm:p-6 min-h-screen bg-cream">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-oranges font-marker  mb-6">
        Manger Management
      </h2>

      <div className="relative w-full max-w-md mx-auto mb-8 group">
        <motion.input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          whileFocus={{
            scale: 1.02,
            boxShadow: "0 0 0 4px rgba(0, 128, 157, 0.2)",
          }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="w-full py-3 pl-12 pr-4 rounded-full border border-oranges bg-cream text-primary placeholder-oranges focus:outline-none focus:border-primary transition-all duration-300"
        />
        <motion.div
          animate={{ x: [0, -1.5, 1.5, -1.5, 1.5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          className="absolute left-4 top-3.5 text-oranges"
        >
          <FaSearch />
        </motion.div>
      </div>

      {error && (
        <div className="text-red-600 text-center mb-4 font-semibold">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200 max-w-7xl mx-auto bg-cream">
        <table className="min-w-full table-fixed rounded-2xl text-sm sm:text-base">
          <thead>
            <tr className="bg-oranges text-white uppercase tracking-wide">
              <th className="py-4 px-4 sm:px-6 rounded-tl-2xl">ID</th>
              <th className="py-4 px-4 sm:px-6">Name</th>
              <th className="py-4 px-4 sm:px-6">Age</th>
              <th className="py-4 px-4 sm:px-6">Email</th>
              <th className="py-4 px-4 sm:px-6">Role</th>
              <th className="py-4 px-4 sm:px-6">Phone</th>
              <th className="py-4 px-4 sm:px-6 rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-peach   text-primary bg-cream transition cursor-pointer"
              >
                <td className="py-3 px-4 sm:px-6 font-mono">{user.id}</td>
                <td className="py-3 px-4 sm:px-6  capitalize font-semibold">
                  {user.firstname} {user.lastname}
                </td>
                <td className="py-3 px-4 sm:px-6">{user.age}</td>
                <td className="py-3 px-4 sm:px-6 truncate max-w-xs">
                  {user.email}
                </td>
                <td className="py-3 px-4 sm:px-6 capitalize font-medium text-primary">
                  {user.role}
                </td>
                <td className="py-3 px-4 sm:px-6">{user.phone}</td>
                <td className="py-3 px-4 sm:px-6 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => openEditModal(user)}
                    className="flex items-center gap-1 sm:gap-2 bg-primary text-white px-6 py-1.5 rounded-full hover:scale-x-105 duration-200 transition"
                  >
                    <FaEdit className="text-sm" />{" "}
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    disabled={deletingId === user.id}
                    className="flex items-center gap-1 sm:gap-2 bg-oranges text-white px-3 py-1.5 rounded-full hover:scale-x-105 duration-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrashAlt className="text-sm" />{" "}
                    <span className="hidden sm:inline">
                      {deletingId === user.id ? "Deleting..." : "Delete"}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm animate-fadeIn">
          <div className="bg-cream p-6 sm:p-10 rounded-3xl max-w-lg w-full shadow-2xl relative animate-slideInUp">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-peach hover:text-oranges hover:scale-105 duration-200 text-4xl "
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-primary font-marker text-center mb-6">
              Edit User
            </h3>

            {["firstname", "lastname", "age", "email", "phone"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  htmlFor={field}
                  className="block text-primary font-semibold mb-2 capitalize"
                >
                  {field}
                </label>
                <input
                  id={field}
                  name={field}
                  value={updateData[field]}
                  onChange={handleChange}
                  className={`w-full p-3 border bg-cream text-oranges rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors[field] && (
                  <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-peach/50 hover:bg-peach text-oranges hover:scale-105 duration-200 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-primary/50 rounded-lg text-white hover:bg-primary  hover:scale-105 duration-200rounded-lg font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm animate-fadeIn">
          <div className="bg-cream p-6 sm:p-10 rounded-3xl max-w-md w-full shadow-2xl relative animate-slideInUp text-center border border-oranges">
            <FaExclamationTriangle
              className="text-oranges mb-4 animate-pulse"
              size={40}
            />
            <h3 className="text-2xl font-bold text-oranges mb-2">
              Confirm Delete
            </h3>
            <p className="text-primary mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-oranges">
                {deletingUser.firstname} {deletingUser.lastname}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={cancelDelete}
                disabled={deletingId !== null}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-primary rounded-lg font-semibold disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="px-4 py-2 bg-oranges hover:bg-peach text-white rounded-lg font-semibold disabled:opacity-50 transition"
              >
                {deletingId !== null ? "Deleting..." : "Delete"}
              </button>
            </div>

            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-primary hover:text-oranges transition"
              aria-label="Close"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideInUp {
        from { transform: translateY(40px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease forwards;
      }
      .animate-slideInUp {
        animation: slideInUp 0.4s ease forwards;
      }
    `}
      </style>
    </div>
  );
}
