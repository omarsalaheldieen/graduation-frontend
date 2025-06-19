import axios from "axios";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Products from "../Products/Products";
import CategoriesSlider from "../Caregories slider/Caregories slider";
import config from "../../config/index";

export default function Home() {
  const { searchTerm } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [productsRes, wishlistRes, cartRes] = await Promise.all([
          axios.get(`${config.API_URL}/products`),
          userToken
            ? axios.get(`${config.API_URL}/wishlist`, {
                headers: { Authorization: `Bearer ${userToken}` },
              })
            : Promise.resolve({
                data: {
                  data: (
                    JSON.parse(localStorage.getItem("wishlist")) || []
                  ).map((id) => ({ product: { id } })),
                },
              }),
          userToken
            ? axios.get(`${config.API_URL}/basket`, {
                headers: { Authorization: `Bearer ${userToken}` },
              })
            : Promise.resolve({
                data: {
                  data: (JSON.parse(localStorage.getItem("cart")) || []).map(
                    (id) => ({ product: { id } })
                  ),
                },
              }),
        ]);

        const fetchedProducts = productsRes?.data?.data || [];
        setProducts(fetchedProducts);

        const wishlistIds = wishlistRes.data.data.map(
          (item) => item.product.id
        );
        setWishlist(wishlistIds);

        const cartIds = cartRes.data.data.map((item) => item.product.id);
        setCart(cartIds);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllData();
  }, [userToken]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => {
        const title = product?.title?.toLowerCase() || "";

        return title.includes(term);
      });
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-cream bg-opacity-80">
        <div className="flex space-x-2 mb-4">
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-orange-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-oranges text-lg animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <>
      <CategoriesSlider />
<div
  className="product-grid  grid grid-cols bg-cream  d-flex justify-center  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-28"
>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Products
              key={product.id}
              product={product}
              wishlist={wishlist}
              cart={cart}
            />
          ))
        ) : (
          <p className="text-gray-600 text-lg col-span-full text-center">
            No products found.
          </p>
        )}
      </div>
    </>
  );
}
