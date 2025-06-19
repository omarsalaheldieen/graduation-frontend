import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [cart, setCart] = useState(localStorage.getItem("cart") || "");

  const login = ({ token, name, role, cartItems }) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    localStorage.setItem("cart", cartItems || "");

    setUserToken(token);
    setUserName(name);
    setUserRole(role);
    setCart(cartItems || "");
  };



  useEffect(() => {
    const sync = () => {
      setUserToken(localStorage.getItem("userToken"));
      setUserName(localStorage.getItem("userName"));
      setUserRole(localStorage.getItem("userRole"));
      setCart(localStorage.getItem("cart") || "");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userName,
        userRole,
        cart,
        login,
       
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
