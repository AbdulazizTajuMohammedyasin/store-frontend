import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";

import { Home } from "./pages/Home/Home";
import { Products } from "./pages/Products/Products";
import { ProductDetail } from "./pages/ProductDetail/ProductDetail";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Collections from "./pages/Collections/Collections";
import CollectionDetail from "./pages/CollectionDetail/CollectionDetail";
import Cart from "./pages/Cart/Cart";
import Orders from "./pages/Orders.tsx/Orders";
import OrderDetail from "./pages/OrderDetail/OrderDetail";
import AddressPage from "./pages/AddressPage/AddressPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

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
        path: "/address",
        element: <AddressPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
