import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
    FaHome, FaCalendarCheck, FaFileAlt, FaEnvelope, 
    FaCog, FaLifeRing, FaUserCircle, FaSignOutAlt 
} from "react-icons/fa";
import axios from "axios";
import "./Sidebar.css"; 

function Sidebar({ activePage }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Hook to navigate after logout

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get("http://127.0.0.1:8000/api/users/me/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login"); // Redirect to login page
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

            {/* User Profile - Slimmer & More Functional */}
            {user && (
                <div className="sidebar-profile">
                    <FaUserCircle className="profile-icon" />
                    <div className="profile-info">
                        <p className="profile-name">{`${user.user_firstName} ${user.user_lastName}`}</p>
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
