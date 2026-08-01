import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";

import { Home } from "./pages/Home/Home";
import { Products } from "./pages/Products/Products";
import { ProductDetail } from "./pages/ProductDetail/ProductDetail";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { Children } from "react";

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
    ],
  },
]);
