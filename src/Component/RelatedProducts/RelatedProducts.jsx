import React from "react";
import { FaStar, FaTruck } from "react-icons/fa";
import { useNavigate,Link } from "react-router-dom";

export default function RelatedProducts({
  products = [],
  wishlistIds = [],
  cartIds = [],
  onToggleWishlist = () => {},
  onToggleCart = () => {},
}) {
  const navigate = useNavigate();
  const restockInDays = Math.floor(Math.random() * 8) + 3;

  return (
    <div className="product-grid  grid grid-cols bg-cream  d-flex justify-center  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:p-28">
      {products.map((product) => (
        <div className="relative group p-4 animate-fade-in-up">
  <div className="max-w-sm bg-cream border border-cream rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03]">
    <div className="relative">
    <Link to={`/productsdetails/${product.id}`}>
        <div className="w-full h-64 bg-cream flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            src={`${config.API_URL}${product.thumbnail}`}
            alt={product.title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-30 transition-opacity"></div>
        </div>
      </Link>

      <span className="absolute top-3 left-3 bg-gradient-to-r from-oranges to-peach text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
        {product.discountPercentage}% OFF
      </span>

      {/* Badges */}
      <div className="absolute bottom-3 left-3 z-10 w-fit">
        {product.stock < 15 && product.stock > 0 && (
          <>
            <div className="absolute animate-badge-a flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow bg-oranges text-white">
              <FaStar className="text-white" /> Best Seller
            </div>
            <div className="animate-badge-b flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow bg-primary text-white">
              <FaTruck className="text-white" /> Free Delivery
            </div>
          </>
        )}
      </div>

      {/* Wishlist */}
        <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className="absolute top-3 right-3 p-2 transition-transform duration-300 hover:scale-110"
              aria-label="Toggle wishlist"
            >
              <svg
                className={`w-6 h-6 ${
                  wishlistIds.includes(product.id) ? "text-oranges" : "text-[#FF7601]"
                }`}
                viewBox="0 0 24 24"
                fill={wishlistIds.includes(product.id) ? "#FF7601" : "none"}
                stroke={wishlistIds.includes(product.id) ? "#FF7601" : "#FF7601"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCart(product.id);
              }}
              disabled={product.stock === 0}
              className="absolute top-10 right-3 p-2 transition-transform duration-300 hover:scale-110"
              aria-label="Toggle cart"
            >
              <svg
                className={`w-6 h-8 ${
                  cartIds.includes(product.id) ? "text-primary" : "text-[#00809D]"
                }`}
                viewBox="0 0 24 24"
                fill={cartIds.includes(product.id) ? "#00809D" : "none"}
                stroke={cartIds.includes(product.id) ? "#00809D" : "#00809D"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 20a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.2 2.3A1 1 0 0 0 5 3v1a1 1 0 0 0 1 1h1l2.68 9.38a1 1 0 0 0 .95.72H18a1 1 0 0 0 .95-.68l3-8a1 1 0 0 0-.94-1.32H7.42L6.2 2.3Z" />
              </svg>
            </button>
    </div>

    {/* Product Info */}
    <div className="p-5">
      <Link to={`productsdetails/${product.id}`}>
        <h5 className="text-xl font-bold font-marker text-oranges truncate">
          {product.title}
        </h5>
      </Link>
      <p className="text-peach text-sm mt-2 mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 ${
                index < Math.round(product.rating)
                  ? "text-oranges animate-star-fill"
                  : "text-peach"
              }`}
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          ))}
          <p className="ps-2 font-medium text-peach">{product.rating}</p>
        </div>

        {/* Stock */}
        <div className="flex gap-2 items-center">
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
            <span className="px-3 py-1 text-xs font-semibold rounded-full shadow-md tracking-wide uppercase font-mono bg-oranges text-white animate-pulse">
              {product.stock} Left – Hurry!
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md tracking-wide uppercase font-mono bg-primary">
              {product.stock} In Stock
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mt-4 mb-4 flex items-center gap-3">
        <span className="text-3xl font-extrabold text-primary">
          ${(product.price * 20).toFixed(2)}
        </span>
        <span className="text-sm text-peach  strike-loop">
          ${(product.price * 2 + product.discountPercentage).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
</div>
      ))}
    </div>
  );
}
