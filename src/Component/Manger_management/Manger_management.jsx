import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { FaEdit, FaTrashAlt, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import config from "../../config";

export default function Manger_management() {
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
      setUsers(users.filter((u) => u.id !== deletingUser.id));
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
      await axios.put(`${config.API_URL}/users/${editingUser.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...updateData } : u)));
      toast.success("User Updated", {
        duration: 3000,
        style: { background: "#10B981", color: "#fff" },
      });
      setEditingUser(null);
    } catch (err) {
      if (err.name === "ValidationError") {
        const errorObj = {};
        err.inner.forEach((e) => (errorObj[e.path] = e.message));
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

  const filteredUsers = users
    .filter((user) => user.role === "user")
    .filter((user) =>
      `${user.firstname} ${user.lastname} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-emerald-700 mb-6">
        User Management
      </h2>

      <input
        type="text"
        placeholder="Search by name, email, role..."
        className="block mx-auto mb-8 p-2 sm:p-3 border rounded-lg w-full max-w-md shadow-md"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && (
        <div className="text-red-600 text-center mb-4 font-semibold">{error}</div>
      )}

      <div className="overflow-x-auto rounded-2xl shadow-2xl border border-gray-300 max-w-full mx-auto">
        <table className="min-w-[800px] w-full bg-white rounded-2xl table-auto">
          <thead>
            <tr className="bg-emerald-600 text-white uppercase tracking-wide text-sm select-none">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Age</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="cursor-pointer hover:bg-emerald-50 transition"
              >
                <td className="py-3 px-4 text-sm whitespace-nowrap truncate font-mono text-gray-700">
                  {user.id}
                </td>
                <td className="py-3 px-4 font-semibold text-gray-800 truncate">
                  {user.firstname} {user.lastname}
                </td>
                <td className="py-3 px-4">{user.age}</td>
                <td className="py-3 px-4 truncate max-w-[150px]">{user.email}</td>
                <td className="py-3 px-4 capitalize font-medium text-emerald-700">
                  {user.role}
                </td>
                <td className="py-3 px-4">{user.phone}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                    <button
                      onClick={() => openEditModal(user)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:brightness-110 text-xs sm:text-sm"
                    >
                      <FaEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      disabled={deletingId === user.id}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:brightness-110 text-xs sm:text-sm disabled:opacity-50"
                    >
                      <FaTrashAlt size={14} />
                      {deletingId === user.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ...Modal and Style Code Remains Unchanged... */}

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        @keyframes slideInUp {
          from {transform: translateY(40px); opacity: 0;}
          to {transform: translateY(0); opacity: 1;}
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
        .animate-slideInUp {
          animation: slideInUp 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
