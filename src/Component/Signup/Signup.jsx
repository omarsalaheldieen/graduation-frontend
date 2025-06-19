import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [apiErr, setApiErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().min(3).max(15).required("First name is required"),
    lastname: Yup.string().min(3).max(15).required("Last name is required"),
    age: Yup.number().min(18).max(100).required("Age is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    phone: Yup.string()
      .matches(/^(01[0-9]{9}|02[0-9]{7})$/, "Phone is invalid")
      .required("Phone is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      age: "",
      email: "",
      phone: "",
      password: "",
    },
    onSubmit: signup,
    validationSchema,
  });

  async function signup(values) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${config.API_URL}/auth/signup`,
        values
      );
      const user = data.data.user;

      localStorage.setItem("userToken", user.accessToken);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userPhone", user.phone);
      localStorage.setItem("userAge", user.age);
      localStorage.setItem("userId", user.id);

      navigate("/");
    } catch (error) {
      setApiErr(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-8 animate-float ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="w-full  max-w-6xl bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden"
      >
        {/* Left Panel with Logo and Welcome */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-oranges p-12 flex flex-col items-center justify-center text-white"
        >
          <div className="relative bg-oranges p-10 flex flex-col items-center justify-center text-white">
            <motion.img
              src="/logo.jpg"
              alt="Logo"
              className="w-36 h-36 object-contain mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <h2 className="text-4xl font-marker font-bold text-center drop-shadow-md">
              Welcome Aboard!
            </h2>
            <p className="text-base text-center mt-3 opacity-90">
              Create an account to join our journey
            </p>
          </div>
        </motion.div>
        {/* Right Panel with Form */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-12 md:p-16 bg-cream backdrop-blur-md"
        >
          <div className="p-10 md:p-14 bg-white/40 backdrop-blur-md">
            <h1 className="text-3xl font-semibold font-marker text-oranges mb-8 text-center">
              Create Your Account
            </h1>

            {apiErr && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-100 text-oranges text-sm rounded px-4 py-2 mb-4"
              >
                {apiErr}
              </motion.div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* First Name */}
              {/* First Name */}
              <div className="relative">
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder=" "
                  {...formik.getFieldProps("firstname")}
                  className="peer w-full px-4 pt-6 pb-2 text-base text-oranges bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-oranges focus:border-oranges transition duration-300 ease-in-out hover:scale-[1.02] shadow-inner"
                  required
                />
                <label
                  htmlFor="firstname"
                  className="absolute left-4 top-1 text-oranges text-sm transition-all duration-300 ease-in-out transform scale-100 
      peer-placeholder-shown:left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-oranges 
      peer-focus:left-2 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-oranges"
                >
                  First Name
                </label>
                {formik.touched.firstname && formik.errors.firstname && (
                  <div className="text-sm text-oranges mt-2 animate-fadeIn">
                    {formik.errors.firstname}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className="relative">
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder=" "
                  {...formik.getFieldProps("lastname")}
                  className="peer w-full px-4 pt-6 pb-2 text-base text-oranges bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-oranges focus:border-oranges transition duration-300 ease-in-out hover:scale-[1.02] shadow-inner"
                  required
                />
                <label
                  htmlFor="lastname"
                  className="absolute left-4 top-1 text-oranges text-sm transition-all duration-300 ease-in-out transform scale-100 
      peer-placeholder-shown:left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-oranges 
      peer-focus:left-2 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-oranges"
                >
                  Last Name
                </label>
                {formik.touched.lastname && formik.errors.lastname && (
                  <div className="text-sm text-oranges mt-2 animate-fadeIn">
                    {formik.errors.lastname}
                  </div>
                )}
              </div>

              {/* Age */}
              <div className="relative">
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder=" "
                  {...formik.getFieldProps("age")}
                  className="peer w-full px-4 pt-6 pb-2 text-base text-oranges bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-oranges focus:border-oranges transition duration-300 ease-in-out hover:scale-[1.02] shadow-inner"
                  required
                />
                <label
                  htmlFor="age"
                  className="absolute left-4 top-1 text-oranges text-sm transition-all duration-300 ease-in-out transform scale-100 
      peer-placeholder-shown:left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-oranges 
      peer-focus:left-2 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-oranges"
                >
                  Age
                </label>
                {formik.touched.age && formik.errors.age && (
                  <div className="text-sm text-oranges mt-2 animate-fadeIn">
                    {formik.errors.age}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder=" "
                  {...formik.getFieldProps("email")}
                  className="peer w-full px-4 pt-6 pb-2 text-base text-oranges bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-oranges focus:border-oranges transition duration-300 ease-in-out hover:scale-[1.02] shadow-inner"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1 text-oranges text-sm transition-all duration-300 ease-in-out transform scale-100 
      peer-placeholder-shown:left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-oranges 
      peer-focus:left-2 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-oranges"
                >
                  Email Address
                </label>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-sm text-oranges mt-2 animate-fadeIn">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder=" "
                  {...formik.getFieldProps("phone")}
                  className="peer w-full px-4 pt-6 pb-2 text-base text-oranges bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-oranges focus:border-oranges transition duration-300 ease-in-out hover:scale-[1.02] shadow-inner"
                  required
                />
                <label
                  htmlFor="phone"
                  className="absolute left-4 top-1 text-oranges text-sm transition-all duration-300 ease-in-out transform scale-100 
      peer-placeholder-shown:left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-oranges 
      peer-focus:left-2 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-oranges"
                >
                  Phone Number
                </label>
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-sm text-oranges mt-2 animate-fadeIn">
                    {formik.errors.phone}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder=" "
                  {...formik.getFieldProps("password")}
                  className="peer w-full px-4 pt-6 pb-2 text-base text-oranges bg-cream border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-oranges focus:border-oranges transition duration-300 ease-in-out hover:scale-[1.02] shadow-inner"
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-1 text-oranges text-sm transition-all duration-300 ease-in-out transform scale-100 
      peer-placeholder-shown:left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-oranges 
      peer-focus:left-2 peer-focus:top-2 peer-focus:scale-90 peer-focus:text-oranges"
                >
                  Password
                </label>
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-oranges cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-sm text-oranges mt-2 animate-fadeIn">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                className="w-full py-3 bg-gradient-to-r from-[#FF7C4C] to-[#FF9A52] text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </motion.button>

              <div className="text-center text-sm text-gray-600 mt-3">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#FF7C4C] hover:underline cursor-pointer"
                >
                  Login
                </span>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
