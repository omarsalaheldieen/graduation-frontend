import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../Context/AuthContext";
import { motion } from "framer-motion";
import config from "../../config";

export default function Login() {
  const [apiErr, setApiErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Min 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleLogin,
    validationSchema,
  });

  async function handleLogin(values) {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${config.API_URL}/auth/login`,
        values
      );
      const user = data.data.user;

      login({ token: user.token, name: user.name, role: user.role });
      localStorage.setItem("userAge", user.age);
      localStorage.setItem("userPhone", user.phone);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.id);

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/dashboard");
        } else if (user.role === "manager") {
          navigate("/manger_dashboard");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (error) {
      setApiErr(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
  <div className="min-h-screen bg-cream flex items-center justify-center px-8 animate-float ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5}}
        className="w-full  max-w-6xl bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden"
      >
        {/* Left Panel */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative bg-oranges p-12 flex flex-col items-center justify-center text-white"
        >
          <motion.img
            src="/logo.jpg"
            alt="Logo"
            className="w-36 h-36 object-contain mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <h2 className="text-4xl font-marker font-bold text-center drop-shadow-md">
            Welcome Backv
          </h2>
          <p className="text-base text-center mt-3 opacity-90">
            Sign in to continue your journey
          </p>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-12 md:p-16 bg-cream backdrop-blur-md"
        >
          <h1 className="text-3xl font-semibold font-marker text-oranges mb-8 text-center">
            Login to Your Account
          </h1>

          {apiErr && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-cream text-oranges text-sm rounded px-4 py-2 mb-4"
            >
              {apiErr}
            </motion.div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6 text-oranges">
            {/* Email */}
            <div className="relative group">
              <input
                type="email"
                name="email"
                id="email"
                placeholder=" "
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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

            {/* Password */}
            <div className="relative group">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                id="password"
                placeholder=" "
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-3.5 text-oranges cursor-pointer peer-focus:text-oranges transition-transform hover:scale-110"
              >
                {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
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
                           {isLoading ? "Logining ..." : "Login"}
                         </motion.button>

            {/* Links */}
            <div className="text-center text-sm text-gray-600 mt-4">
              <a href="#" className="text-oranges hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="text-center text-sm text-peach">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-oranges hover:underline cursor-pointer"
              >
                Sign Up
              </span>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>

  );
}
