import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, FaCalendarCheck, FaFileAlt, FaEnvelope, 
  FaCog, FaLifeRing, FaUserCircle, FaSignOutAlt 
} from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar({ activePage }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Utility to decode JWT payload
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      const payload = decodeJWT(token);
      if (payload) {
        // Adjust these keys depending on what your token includes.
        // For example, if your payload includes "username" and "email":
        setUser(payload);
      }
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <ul className="menu">
        <li>
          <NavLink to="/dashboard" className={activePage === "dashboard" ? "active" : ""}>
            <FaHome className="icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/appointments" className={activePage === "appointments" ? "active" : ""}>
            <FaCalendarCheck className="icon" /> Appointments
          </NavLink>
        </li>
        <li>
          <NavLink to="/documents" className={activePage === "documents" ? "active" : ""}>
            <FaFileAlt className="icon" /> Documents
          </NavLink>
        </li>
        <li>
          <NavLink to="/messages" className={activePage === "messages" ? "active" : ""}>
            <FaEnvelope className="icon" /> Messages
          </NavLink>
        </li>
      </ul>

      {/* Support & Settings Section */}
      <ul className="bottom-menu">
        <li>
          <NavLink to="/support" className={activePage === "support" ? "active" : ""}>
            <FaLifeRing className="icon" /> Support
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={activePage === "settings" ? "active" : ""}>
            <FaCog className="icon" /> Settings
          </NavLink>
        </li>
      </ul>

      {/* User Profile */}
      {user && (
        <div className="sidebar-profile">
          <FaUserCircle className="profile-icon" />
          <div className="profile-info">
            {/* adjust these fields based on your token payload */}
            <p className="profile-name">{`${user.user_firstName || user.username} ${user.user_lastName || ""}`}</p>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      )}

      {/* Log Out Button */}
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt className="icon" /> Log Out
      </button>
    </div>
  );
}

export default Sidebar;
