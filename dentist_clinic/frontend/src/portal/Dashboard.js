import React from "react";
import Sidebar from "../components/Sidebar";
import "./Portal.css"; // Global styling

function Dashboard() {
    return (
        <div className="page-container">
            <Sidebar activePage="dashboard" />
            <div className="dashboard-content">
                <h1 className="page-title">Dashboard</h1>

                <div className="dashboard-sections">
                    {/* Upcoming Appointment */}
                    <div className="card">
                        <h2>Upcoming Appointment</h2>
                        <div className="appointment-details">
                            <img src="/profile-placeholder.jpg" alt="Dentist" className="profile-pic" />
                            <p>You’ll be meeting with Dr. <b>Dentist Name</b> on <b>Date</b> at <b>Time</b>!</p>
                            <p><b>Location:</b> Clinic Address</p>
                            <a href="#" className="link">Reschedule your appointment</a>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="card">
                        <h2>Notifications</h2>
                        <p>You have no new notifications</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="card quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="actions-grid">
                            <div className="action">
                                <img src="/calendar-icon.png" alt="Schedule" />
                                <p>Schedule an appointment</p>
                            </div>
                            <div className="action">
                                <img src="/update-icon.png" alt="Update Info" />
                                <p>Update your information</p>
                            </div>
                            <div className="action">
                                <img src="/messages-icon.png" alt="Messages" />
                                <p>View messages</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
