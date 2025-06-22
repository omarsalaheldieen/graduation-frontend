import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../../config";

export default function AddUserPage() {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().min(3).max(20).required("First name is required"),
    lastname: Yup.string().min(3).max(20).required("Last name is required"),
    age: Yup.number().min(18).max(100).required("Age is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^(01[0-9]{9}|02[0-9]{7})$/, "Invalid phone number")
      .required("Phone is required"),
    password: Yup.string().min(6).required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      const { data } = await axios.post(`${config.API_URL}/auth/signup`, values);
      toast.success("User created successfully!");
      setValues({
        firstname: "",
        lastname: "",
        age: "",
        email: "",
        phone: "",
        password: "",
        role: "",
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const formErrors = {};
        err.inner.forEach((e) => {
          formErrors[e.path] = e.message;
        });
        setErrors(formErrors);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto p-8 bg-cream rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold mb-6 text-center text-oranges font-marker">
          Create New User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "First Name", name: "firstname" },
            { label: "Last Name", name: "lastname" },
            { label: "Age", name: "age", type: "number" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone" },
            { label: "Password", name: "password", type: "password" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium  text-oranges font-medium">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={values[name]}
                onChange={handleChange}
                className={`w-full border border-oranges rounded-[8px] px-4 pt-6 pb-2 text-oranges bg-cream shadow placeholder-peach focus:ring-2 focus:ring-oranges focus:border-oranges focus:outline-none ${
                  errors[name] ? "border-oranges p-5" : "border-gray-300"
                }`}
              />
              {errors[name] && <p className="text-oranges text-sm">{errors[name]}</p>}
            </div>
          ))}

       {/* Role Select */}
<div>
  <label
    htmlFor="role"
    className="block text-sm font-medium text-oranges font-medium"
  >
    Role
  </label>
  <select
    id="role"
    name="role"
    value={values.role}
    onChange={handleChange}
  className={`mt-1 block w-full px-4 py-2 border rounded-[8px] shadow bg-cream text-oranges placeholder-peach
    focus:ring-2 focus:ring-oranges focus:border-oranges focus:outline-none 
    hover:border-oranges hover:shadow-md
    transition duration-200 ease-in-out
    appearance-none
    ${
      errors.role
        ? "border-oranges p-5"
        : "border-oranges"
    }
  `}
  >
    <option value="" disabled className="text-peach">
      Select role
    </option>
    <option className="hover:bg-oranges hover:text-white " value="admin">Admin</option>
    <option value="manager">Manager</option>
    <option value="user">User</option>
  </select>
  {errors.role && (
    <p className="text-oranges pt-3 text-sm">{errors.role}</p>
  )}
</div>


          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-oranges text-white font-semibold px-6 py-2 rounded-lg hover:scale-x-105 duration-200 transition"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
