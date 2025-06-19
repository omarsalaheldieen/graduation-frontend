import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import { FaShieldAlt, FaTruck, FaExchangeAlt, FaStore } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import ProductSpecification from "../ProductSpeciication/ProductSpeciication";
import RelatedProducts from "../RelatedProducts/RelatedProducts";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userToken = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState(null);
  const restockInDays = Math.floor(Math.random() * 8) + 3;

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { Authorization: `Bearer ${userToken}` },
  });

  useEffect(() => {
    (async () => {
      try {
        const { data: pRes } = await axios.get(`http://localhost:8080/products/id/${id}`);
        const p = pRes.data;
        setProduct(p);
        setImages(p.images?.map((path) => `http://localhost:8080${path}`) || []);

        const { data: rRes } = await axios.get(`http://localhost:8080/products/category/${p.category}`);
        setRelated(rRes.data || []);
      } catch (e) {
        console.error(e);
        setError("Could not load product.");
      }
    })();
  }, [id]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userToken || !userId) return;
      try {
        const res = await axiosInstance.get("/wishlist");
        const ids = res.data.data.map((item) => item.product.id);
        setWishlistIds(ids);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    const fetchCart = async () => {
      if (!userToken || !userId) return;
      try {
        const res = await axiosInstance.get("/basket");
        const ids = res.data.data.map((item) => item.product.id);
        setCartIds(ids);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchWishlist();
    fetchCart();
  }, [userToken, userId]);

  const toggleWishlist = async (productId) => {
    if (!userToken || !userId) return navigate("/login");
    try {
      if (wishlistIds.includes(productId)) {
        await axiosInstance.delete("/wishlist", { data: { productId, userId } });
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist");
      } else {
        await axiosInstance.post("/wishlist", { productId, userId });
        setWishlistIds((prev) => [...prev, productId]);
        toast.success("Added to wishlist");
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const toggleCart = async (productId) => {
    if (!userToken || !userId) return navigate("/login");
    try {
      if (cartIds.includes(productId)) {
        await axiosInstance.delete("/basket", { data: { productId, userId } });
        setCartIds((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from cart");
      } else {
        await axiosInstance.post("/basket", { productId, userId });
        setCartIds((prev) => [...prev, productId]);
        toast.success("Added to cart");
      }
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Cart error:", err);
      toast.error("Failed to update cart");
    }
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!product)
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-black bg-opacity-60">
        <div className="flex space-x-2 mb-4">
          <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-green-200 text-lg animate-pulse">Loading products...</p>
      </div>
    );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    adaptiveHeight: true,
    centerMode: true,
    centerPadding: "1px",
  };


  return (
    <div className="p-6 min-h-screen bg-cream animate-fade-in">
<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-cream backdrop-blur-xl border border-white/30 rounded-[2rem] shadow-[0_10px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 transition-all min-h-[600px]">

  {/* Image Slider */}
  <div className="rounded-2xl overflow-hidden">
    {product.images.length > 0 ? (
      <Slider {...settings}>
        {images.map((src, i) => (
          <div key={i} className="w-full h-[500px] flex items-center justify-center bg-cream">
            <img src={src} alt={`product-${i}`} className="max-h-full object-contain bg-cream" />
          </div>
        ))}
      </Slider>
    ) : (
      <div className="h-64 bg-[#FCECDD] flex items-center justify-center overflow-hidden">
        <img src="fallback-image.jpg" alt="Fallback" className="w-full h-full object-contain" />
      </div>
    )}
  </div>

  {/* Product Info */}
  <div className="text-[#333] space-y-4 overflow-y-auto max-h-[90vh] flex flex-col justify-center py-6">
    <div>
      <h1 className="text-3xl font-bold text-oranges font-marker line-clamp-2">{product.title}</h1>
      <p className="text-peach text-base line-clamp-4 mt-2">{product.description}</p>

      <div className="space-y-2 text-sm mt-4">
        <div className="flex items-center">
          <FaStore className="mr-2 text-primary" />
          <span className="text-primary">{product.brand}</span>
        </div>
        <div className="flex items-center">
          <FaShieldAlt className="mr-2 text-oranges" />
          <span className="text-peach">{product.warrantyInformation}</span>
        </div>
        <div className="flex items-center">
          <FaTruck className="mr-2 text-primary" />
          <span className="text-primary">{product.shippingInformation}</span>
        </div>
        <div className="flex items-center">
          <FaExchangeAlt className="mr-2 text-oranges" />
          <span className="text-peach">{product.returnPolicy}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4 mt-6 flex-wrap">
        <span className="text-3xl font-extrabold text-[#00809D]">
          ${(product.price * 2).toFixed(2)}
        </span>
        <span className="text-sm text-[#FF7601] line-through strike-loop">
          ${(product.price * 2 + product.discountPercentage).toFixed(2)}
        </span>

        {product.stock < 15 && (
          <div className="relative flex flex-wrap mb-1">
            <div className="absolute flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow bg-oranges text-white animate-badge-a">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
              </svg>
              <span>Best Seller</span>
            </div>
            <div className="left-40 flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow bg-[#00809D] text-white animate-badge-b">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 3h13v13H3V3zm13 0h5l-1.5 5h-3.5V3zm-5 13a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
              </svg>
              <span>Free Delivery</span>
            </div>
          </div>
        )}
      </div>

      {/* Stock & Rating */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <div className="animate-fade-in-up transition-all duration-500 ease-out w-fit flex items-center gap-2">
          {product.stock === 0 ? (
            <>
                  <span className="absolute px-3 py-1 text-xs font-semibold text-white bg-oranges rounded-full shadow-md uppercase animate-badge-a">
                Out of Stock
              </span>
              {restockInDays && (
          <span className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full shadow-md animate-badge-b">
                  Restock in {restockInDays} days
                </span>
              )}
            </>
          ) : product.stock < 6 ? (
            <span className="px-3 py-1 text-xs font-semibold rounded-full shadow-md uppercase font-mono bg-[#FF7601] text-white animate-pulse">
              {product.stock} Left – Hurry!
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md font-mono bg-[#00809D]">
              {product.stock} In Stock
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1" aria-label={`Rating: ${product.rating}`}>
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 ${
                index < Math.round(product.rating)
                  ? "text-oranges animate-star-fill"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          ))}
          <span className="text-sm font-medium text-peach ml-2">{product.rating}</span>
        </div>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-4 mt-6 p-2 flex-wrap">

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className={`group relative overflow-hidden flex-1 py-3 rounded-xl text-lg font-semibold shadow-xl transition-all duration-300 focus:outline-none  focus:ring-offset-2  
        ${wishlistIds.includes(product.id)
          ? "bg-oranges text-white"
          : "bg-[#FCECDD]  text-primary"
        } hover:scale-[1.03] hover:-rotate-1`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
        
          {wishlistIds.includes(product.id) ? "Wishlisted" : "Add to Wishlist"}
        </span>
        <span className="absolute inset-0 bg-peach opacity-0 group-hover:opacity-20 transition-all duration-500 blur-lg z-0"></span>
      </button>

      {/* Cart Button */}
      <button
        onClick={() => toggleCart(product.id)}
        disabled={product.stock === 0}
        className={`group relative overflow-hidden flex-1 py-3 rounded-xl text-lg font-semibold shadow-xl transition-all duration-300 focus:outline-none  
        ${cartIds.includes(product.id)
          ? "bg-primary text-white"
          : "bg-[#FCECDD] text-oranges"
        } hover:scale-[1.03] hover:rotate-1 ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
         
          {cartIds.includes(product.id) ? "In Cart" : "Add to Cart"}
        </span>
        <span className="absolute inset-0 bg-peach opacity-0 group-hover:opacity-20 transition-all duration-500 blur-lg z-0"></span>
      </button>

    </div>
  </div>
</div>





      {/* Extra Sections */}
     <div className="max-w-7xl mx-auto mt-16 animate-fade-in">
  <div className="bg-cream backdrop-blur-xl border border-white/30 rounded-[2rem] shadow-[0_10px_50px_rgba(0,0,0,0.1)] p-6 md:p-10">
    <ProductSpecification product={product} />
  </div>
</div>

      <div className="max-w-7xl mx-auto mt-16 animate-fade-in">
        <RelatedProducts
          products={related}
          wishlistIds={wishlistIds}
          cartIds={cartIds}
          onToggleWishlist={toggleWishlist}
          onToggleCart={toggleCart}
        />
      </div>
    </div>
  );
}
