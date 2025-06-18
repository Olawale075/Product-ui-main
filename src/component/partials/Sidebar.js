import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { FaBell } from "react-icons/fa";

const Sidebar = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="bg-light vh-100 d-flex flex-column shadow-sm" style={{ width: "250px" }}>
      {/* Profile Section */}
      <div className="text-center p-4 border-bottom">
        <img
          src={process.env.PUBLIC_URL + "/Avatar.png"}
          className="rounded-circle img-fluid"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
          alt="User"
        />
        <h6 className="mt-2 mb-0">{userName}</h6>
     
      </div>

      {/* Navigation Links */}
      <div className="flex-grow-1 p-3">
        <NavLink className="d-flex align-items-center text-decoration-none text-dark py-2" to="/">
          <AiFillHome className="me-2" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink className="d-flex align-items-center text-decoration-none text-dark py-2" to="/variables">
          <AiFillSetting className="me-2" />
          <span>Variable Configs</span>
        </NavLink>

        <NavLink className="d-flex align-items-center text-decoration-none text-dark py-2" to="/det">
          <FaBell className="me-2" />
          <span>Settings</span>
        </NavLink>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light text-center p-3 mt-4">
        FireEyes © {new Date().getFullYear()} — Gas Detector Monitoring
      </footer>
    </div>
  );
};

export default Sidebar;
