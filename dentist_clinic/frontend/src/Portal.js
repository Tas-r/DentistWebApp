import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome, FaCalendar, FaFileAlt, FaEnvelope, FaCog, FaLifeRing, FaUserCircle } from "react-icons/fa";
import "./Portal.css"; // Import the CSS for styling

function Portal() {
    const [dentists, setDentists] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access"); // Get stored token
        console.log("Using token:", token);
        
        axios.get("http://127.0.0.1:8000/api/dentists/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("Dentist data received:", response.data);
            setDentists(response.data);
        })
        .catch(error => console.error("Error fetching dentists:", error));
    }, []);
    
    return (
        <div className="portal-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Dental Portal</h2>
                </div>
                <nav>
                    <ul>
                        <li className="active"><FaHome /> Dashboard</li>
                        <li><FaCalendar /> Appointments</li>
                        <li><FaFileAlt /> Documents</li>
                        <li><FaEnvelope /> Messages</li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <ul>
                        <li><FaLifeRing /> Support</li>
                        <li><FaCog /> Settings</li>
                    </ul>
                    <div className="user-info">
                        <FaUserCircle size={40} />
                        <div>
                            <p>Kate Tanner</p>
                            <small>kate@tateeda.com</small>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Dashboard Content */}
            <main className="dashboard">
                <h1>Dashboard</h1>
                
                <div className="dashboard-grid">
                    {/* Upcoming Appointment */}
                    <div className="card">
                        <h2>Upcoming Appointment</h2>
                        <div className="appointment-details">
                            <img src="https://via.placeholder.com/50" alt="Dentist" className="profile-pic" />
                            <p>You’ll be meeting with Dr. <strong>Dentist Name</strong> on <strong>[Date]</strong> at <strong>[Time]</strong>!</p>
                            <p>Location: <strong>[Clinic Address]</strong></p>
                        </div>
                        <a href="#">Reschedule your appointment</a>
                    </div>

                    {/* Notifications */}
                    <div className="card">
                        <h2>Notifications</h2>
                        <p>You have no new notifications</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="actions">
                            <div className="action">
                                <img src="https://via.placeholder.com/80" alt="Schedule" />
                                <p>Schedule an appointment</p>
                            </div>
                            <div className="action">
                                <img src="https://via.placeholder.com/80" alt="Update Info" />
                                <p>Update your information</p>
                            </div>
                            <div className="action">
                                <img src="https://via.placeholder.com/80" alt="Messages" />
                                <p>View messages</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Portal;

