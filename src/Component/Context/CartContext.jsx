// Context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cartData.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    const onCartUpdated = () => updateCartCount();

    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("storage", (e) => {
      if (e.key === "cart") updateCartCount();
    });

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
