import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Products } from "./pages/Products/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products",
    element: <Products />,
  },
]);
