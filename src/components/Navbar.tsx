import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setUser(null);

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          DexShop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav gap-lg-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/collections">
                Collections
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Products
              </NavLink>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/cart">
                    Cart
                  </NavLink>
                </li>
                <li className="nav-item">
                  <span className="nav-link">Hello, {user.username}</span>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/address">
                    Address
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    Profile
                  </NavLink>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
