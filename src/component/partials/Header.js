import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaSyncAlt, FaSignOutAlt } from "react-icons/fa";
import "./Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Needed for navbar toggle, modals, dropdowns

const Header = () => {
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold text-light">
           Weather Station 
        </Link>

        {/* Toggle for mobile */}
        <button
  className="navbar-toggler"
  type="button"
  data-bs-toggle="collapse"
  data-bs-target="#navbarNav"
  aria-controls="navbarNav"
  aria-expanded="false"
  aria-label="Toggle navigation"
>
  <span className="navbar-toggler-icon"></span>
</button>

<div className="collapse navbar-collapse justify-content-end" id="navbarNav">
  ...
</div>


        {/* Collapsible menu */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/user/linkdetector" className="nav-link text-light">
                Link Detector
              </Link>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                onClick={handleRefresh}
              >
                <FaSyncAlt /> Refresh
              </button>
            </li>

            {/* User info */}
            <li className="nav-item d-flex align-items-center gap-2 text-light px-2">
              <FaUserCircle className="fs-4" />
              <span className="d-none d-sm-inline">{userName}</span>
            </li>

            {/* Logout button */}
            <li className="nav-item">
              <button
                className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
