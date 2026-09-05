import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Chatbot from "./Chatbot";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Chatbot />
    </>
  );
}
