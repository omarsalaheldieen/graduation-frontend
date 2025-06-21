import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import config from "../../config";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import { FaStar, FaTruck } from "react-icons/fa";
export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [form, setForm] = useState({
    existingThumbnail: "",
    thumbnail: null,
    existingImages: [],
    images: [],
  });
  const [open, setOpen] = useState(false);
 const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, []);
 const restockInDays = Math.floor(Math.random() * 8) + 3;
  const navigate = useNavigate();
  async function fetchProducts() {
    try {
      const res = await axios.get(`${config.API_URL}/products`);
      const list = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProducts(list);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsLoading(false); // end loading
    }
  }

  function editProduct(p) {
    setEditing(p);
    setForm({
      ...p,
      existingThumbnail: p.thumbnail || "",
      thumbnail: null,
      existingImages: Array.isArray(p.images) ? p.images : [],
      images: [],
    });
    setOpen(true);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onFile(e) {
    const { name, files } = e.target;
    if (name === "thumbnail") {
      setForm((f) => ({ ...f, thumbnail: files[0] }));
    } else if (name === "images") {
      setForm((f) => ({ ...f, images: Array.from(files) }));
    }
  }

  async function save() {
    if (!editing) return;
    const token = localStorage.getItem("userToken");
    const fd = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (
        ["thumbnail", "images", "existingThumbnail", "existingImages"].includes(
          key
        )
      )
        return;
      fd.append(
        key,
        Array.isArray(val) || typeof val === "object"
          ? JSON.stringify(val)
          : val
      );
    });

    fd.append("existingImages", JSON.stringify(form.existingImages));

    if (form.thumbnail instanceof File) {
      fd.append("thumbnail", form.thumbnail);
    }

    if (form.images.length > 0) {
      form.images.forEach((img) => {
        fd.append("images", img);
      });
    }

    try {
         setIsSaving(true); // start saving
      await axios.put(`${config.API_URL}/products/${editing.id}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchProducts();
      setOpen(false);
    } catch (err) {
      console.error("Save failed:", err.response?.data || err);
     } finally {
      setIsSaving(false); // end saving
    }
  }

  return (
      <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col justify-center items-center z-40 bg-cream/80 backdrop-blur-sm rounded-xl">
          <div className="flex space-x-2 mb-4">
            <div className="w-4 h-4 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4 h-4 bg-orange-600 rounded-full animate-bounce"></div>
          </div>
          <p className="text-oranges text-lg animate-pulse">
            Loading products...
          </p>
        </div>
      )}
      <h1 className="text-4xl pt-20 text-oranges font-marker text-center  bg-cream">
        {" "}
        Update Products{" "}  
      </h1>
      <div className="product-grid  grid grid-cols bg-cream  min-h-screen d-flex justify-center  md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:p-28">
        {products.map((product) => (
          <div className="relative group p-4 animate-fade-in-up">
            <div className="max-w-sm bg-cream border border-cream rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03]">
              <div className="relative">
                <div
                  onClick={() => navigate(`/productsdetails/${product.id}`)}
                  className="w-full h-64 bg-cream flex items-center justify-center overflow-hidden"
                >
                  <img
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  src={`${config.API_URL}${product.thumbnail}`}
                    alt={product.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-30 transition-opacity"></div>
                </div>

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
                    <p className="ps-2 font-medium text-peach">
                      {product.rating}
                    </p>
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
                    ${(product.price * 10).toFixed(2)}
                  </span>
                  <span className="text-sm text-peach  strike-loop">
                    $
                    {(product.price * 10 + product.discountPercentage).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>
              <button
                onClick={() => editProduct(product)}
                className="mt-2 w-full bg-oranges  text-white py-2  hover:text-primary"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
        {/* Modal */}
        <Dialog className="z-50" open={open} onClose={() => setOpen(false)}>
          <div className="fixed inset-0  bg-black/30 " />
          <div className="fixed inset-0 flex items-center z-50 justify-center p-4 font-handwriting">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-cream   shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] custom-scrollbar overflow-auto"
            >
              <div className="flex justify-between  items-center mb-8">
                <div className="flex items-center gap-3">
                  <img
                    src="/logho.png"
                    alt="Logo"
                    className="h-10 w-10 animate-float"
                  />
                  <Dialog.Title className="text-3xl font-marker text-oranges font-extrabold">
                    Edit Product
                  </Dialog.Title>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-3xl text-oranges hover:text-red-500"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "title",
                  "description",
                  "category",
                  "price",
                  "discountPercentage",
                  "rating",
                  "stock",
                  "tags",
                  "brand",
                  "sku",
                  "weight",
                  "width",
                  "height",
                  "depth",
                  "warrantyInformation",
                  "shippingInformation",
                  "availabilityStatus",
                  "returnPolicy",
                  "minimumOrderQuantity",
                  "barcode",
                  "qrCode",
                  "reviews",
                ].map((f) => (
                  <div key={f}>
                    <label className="block text-oranges font-semibold mb-1 capitalize">
                      {f}
                    </label>
                    <input
                      name={f}
                      value={
                        Array.isArray(form[f])
                          ? form[f].join(", ")
                          : form[f] ?? ""
                      }
                      onChange={onChange}
                      className="w-full border border-oranges rounded-xl p-2 bg-cream shadow"
                    />
                  </div>
                ))}
              </div>

              {/* Upload Media */}
              <div className="mt-8">
                <div className="text-xl font-bold text-oranges flex items-center gap-2 mb-4">
                  <FaUpload />
                  Upload Media
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Thumbnail */}
                  <div>
                    <label
                      htmlFor="thumbnail-upload"
                      className="block text-oranges mb-1"
                    >
                      Thumbnail
                    </label>
                    <label
                      htmlFor="thumbnail-upload"
                      className="inline-block bg-oranges text-white px-4 py-2 rounded-lg shadow cursor-pointer hover:bg-orange-500 transition"
                    >
                      Choose Thumbnail
                    </label>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      name="thumbnail"
                      accept="image/*"
                      onChange={onFile}
                      className="hidden"
                    />
                    <div className="mt-2">
                      {form.thumbnail ? (
                        <img
                          src={URL.createObjectURL(form.thumbnail)}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : form.existingThumbnail ? (
                        <img
                         src={`${config.API_URL}${form.existingThumbnail}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : null}
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <label
                      htmlFor="gallery-upload"
                      className="block text-oranges mb-1"
                    >
                      Gallery Images
                    </label>
                    <label
                      htmlFor="gallery-upload"
                      className="inline-block bg-oranges text-white px-4 py-2 rounded-lg shadow cursor-pointer hover:bg-orange-500 transition"
                    >
                      Choose Images
                    </label>
                    <input
                      id="gallery-upload"
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={onFile}
                      className="hidden"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.existingImages.map((url, i) => (
                        <div key={`existing-${i}`} className="relative group">
                          <img
                               src={`${config.API_URL}${url}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <button
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                existingImages: f.existingImages.filter(
                                  (_, idx) => idx !== i
                                ),
                              }))
                            }
                            className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full text-xs hidden group-hover:flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {form.images.map((img, i) => (
                        <img
                          key={`new-${i}`}
                          src={URL.createObjectURL(img)}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-10 flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 bg-peach text-white rounded-full font-bold shadow hover:bg-orange-400 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: isSaving ? 1 : 1.05 }}
                  whileTap={{ scale: isSaving ? 1 : 0.95 }}
                  onClick={save}
                  disabled={isSaving}
                  className={`px-6 py-3 rounded-full font-bold shadow transition ${
                    isSaving
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-oranges hover:bg-orange-500 text-white"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
