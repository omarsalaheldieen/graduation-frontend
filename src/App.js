
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./Component/Layout/Layout";
import Home from "./Component/Home/Home";
import Products from "./Component/Products/Products";
import ProductsDetails from "./Component/ProductsDetails/ProductsDetails";
import Wishist from "./Component/Wishlist/Wishist";
import Signup from "./Component/Signup/Signup";
import Cart from "./Component/Cart/Cart";
import Login from "./Component/Login/Login";
import Profile from "./Component/Profile/Profile";
import Dashboard from "./Component/Dashboard/Dashboard";
import AdminManagement from "./Component/Admin_managment/Admin_managment";
import ProductManagement from "./Component/Product_Mangment/Product_Mangment";
import { AuthProvider } from "./Component/Context/AuthContext";
import { CartProvider } from "./Component/Context/CartContext";
import DashboardLayout from "./Component/Layout/DashboardLayout";
import Delete_Product from "./Component/Delete_Product/Delete_Product";
import Manger_management from "./Component/Manger_management/Manger_management";
import Women from "./Component/Women/Women";
import Men from "./Component/Men/Men";
import Beauty from "./Component/Beauty/Beauty";
import Electronics from "./Component/Electronics/Electronics";
import Furniture from "./Component/Furniture/Furniture";
import Groceries from "./Component/Groceries/Groceries";
import Update_Product from "./Component/Update_Product/Update_Product";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import AddUsers from "./Component/AddUsers/AddUsers";
import Manger_dashboard from "./Component/Manger_dashboard/Manger_dashboard";
import MangerLayout from "./Component/Layout/MangerLayout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "wishlist", element: <Wishist /> },
      { path: "cart", element: <Cart /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "profile", element: <Profile /> },
      { path: "women", element: <Women /> },
      { path: "men", element: <Men /> },
      { path: "beauty", element: <Beauty /> },
      { path: "furniture", element: <Furniture /> },
      { path: "groceries", element: <Groceries /> },
      { path: "electronics", element: <Electronics /> },
    
      { path: "add_users", element: <AddUsers/> },
      { path: "productsdetails/:id", element: <ProductsDetails /> },
    ],
  },
  {
  path: "dashboard",
  element: <DashboardLayout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "admin", element: <AdminManagement /> },
    { path: "product_man", element: <ProductManagement /> },
    { path: "delete_Product", element: <Delete_Product /> },
    { path: "update_Product", element: <Update_Product /> },

  ],
},
  {
  path: "manger_dashboard",
  element: <MangerLayout />,
  children: [
    { index: true, element: <Manger_dashboard /> },
    { path: "manger_man", element: <Manger_management /> },
    { path: "add_users", element: <AddUsers/> },
    { path: "product_man", element: <ProductManagement /> },
    { path: "delete_Product", element: <Delete_Product /> },
    { path: "update_Product", element: <Update_Product /> },

  ],
}
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FCECDD",
              color: "#FF7601",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "18px",
              fontFamily:"Permanent Marker"
            },
             success: {
      icon: <FiCheckCircle className="text-[#00809D] animate-fade-in-up font-extrabold" />,
    },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
