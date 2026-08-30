import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home/Home";
import { Products } from "./pages/Products/Products";
import { ProductDetail } from "./pages/ProductDetail/ProductDetail";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Collections from "./pages/Collections/Collections";
import CollectionDetail from "./pages/CollectionDetail/CollectionDetail";
import Cart from "./pages/Cart/Cart";
import Orders from "./pages/Orders.tsx/Orders";
import OrderDetail from "./pages/OrderDetail/OrderDetail";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import PaymentPage from "./pages/Payment/PaymentPage";
import ActivateAccount from "./pages/ActivateAccount/ActivateAccount";
import ResendVerification from "./pages/ResendVerification/ResendVerification";
import DashboardPage from "./pages/Admin/DashboardPage";
import AdminLayout from "./components/AdminLayout";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminCollections from "./pages/Admin/AdminCollections";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminCustomers from "./pages/Admin/AdminCustomers";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminRoute from "./pages/Admin/Adminroute";
import Chatbot from "./components/Chatbot";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <ProductDetail />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/collections/:id",
        element: <CollectionDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/:id",
        element: <OrderDetail />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/payment",
        element: <PaymentPage />,
      },
      {
        path: "/activate/:uid/:token",
        element: <ActivateAccount />,
      },
      {
        path: "/resend-verification",
        element: <ResendVerification />,
      },
      {
        path: "/chat",
        element: <Chatbot />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "/admin/", element: <Navigate to="/admin/dashboard" replace /> },
      { path: "/admin/dashboard", element: <DashboardPage /> },
      { path: "/admin/products", element: <AdminProducts /> },
      { path: "/admin/collections", element: <AdminCollections /> },
      { path: "/admin/orders", element: <AdminOrders /> },
      { path: "/admin/customers", element: <AdminCustomers /> },
    ],
  },
]);
