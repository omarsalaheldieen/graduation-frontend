import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import config from "../../config";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    existingThumbnail: "",
    thumbnail: null,
    existingImages: [],
    images: [],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get(`${config.API_URL}/products`);
      const list = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProducts(list);
    } catch (err) {
      console.error("Fetch failed:", err);
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
      if (["thumbnail", "images", "existingThumbnail", "existingImages"].includes(key)) return;
      fd.append(key, Array.isArray(val) || typeof val === "object" ? JSON.stringify(val) : val);
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
    }
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {products.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <img
              src={`${config.API_URL}${p.thumbnail}`}
              alt={p.title}
              className="object-contain max-h-full"
            />
          </div>
          <div className="p-4">
            <h3 className="font-bold truncate">{p.title}</h3>
            <p className="text-green-600 font-semibold">${p.price}</p>
            <button
              onClick={() => editProduct(p)}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 overflow-auto max-h-[90vh]">
            <div className="flex justify-between mb-4">
              <Dialog.Title className="text-2xl font-bold">Edit Product</Dialog.Title>
              <button onClick={() => setOpen(false)}>×</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                "title", "description", "category", "price", "discountPercentage",
                "rating", "stock", "tags", "brand", "sku", "weight", "width",
                "height", "depth", "warrantyInformation", "shippingInformation",
                "availabilityStatus", "returnPolicy", "minimumOrderQuantity",
                "barcode", "qrCode", "reviews"
              ].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium mb-1">{f}</label>
                  <input
                    name={f}
                    value={Array.isArray(form[f]) ? form[f].join(", ") : form[f] ?? ""}
                    onChange={onChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              ))}

              {/* Thumbnail */}
              <div className="col-span-2">
                <label className="block mb-1">Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={onFile}
                  className="w-full"
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
              <div className="col-span-2">
                <label className="block mb-1">Gallery Images</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={onFile}
                  className="w-full"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {/* Existing Images (removable) */}
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
                            existingImages: f.existingImages.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
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

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
