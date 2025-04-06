import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";
import axios from "axios";

function AppointmentConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { dentist, date, time, reason, notes } = location.state || {};

    const [dentistName, setDentistName] = useState(null);
    const [serviceName, setServiceName] = useState(null);

    useEffect(() => {
        const fetchDentistName = async () => {
            try {
                const token = localStorage.getItem("access");
                const res = await axios.get(`http://127.0.0.1:8000/users/dentists/${dentist}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const user = res.data.user;
                const fullName = user.first_name || user.last_name
                    ? `Dr. ${user.first_name} ${user.last_name}`.trim()
                    : `Dr. ${user.username}`;
                setDentistName(fullName);
            } catch (err) {
                console.error("Failed to fetch dentist name:", err);
                setDentistName(`Dentist #${dentist}`);
            }
        };

        const fetchServiceName = async () => {
            try {
                const token = localStorage.getItem("access");
                const res = await axios.get("http://127.0.0.1:8000/appointments/services/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const service = res.data.find(s => s.id === reason);
                setServiceName(service ? service.name : `Service #${reason}`);
            } catch (err) {
                console.error("Failed to fetch service name:", err);
                setServiceName(`Service #${reason}`);
            }
        };

        if (dentist) fetchDentistName();
        if (reason) fetchServiceName();
    }, [dentist, reason]);

    return (
        <div className="page-container">
            <Sidebar />
            <div className="content">
                <h1 className="page-title">Appointment Confirmed</h1>
                <div className="confirmation-wrapper" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <p className="confirmation-text" style={{ fontSize: "18px", lineHeight: "1.6" }}>
                        Your appointment with <strong>{dentistName || "your dentist"}</strong> has been successfully scheduled for <strong>{date}</strong> at <strong>{time}</strong>.<br /><br />
                        The reason selected was <strong>{serviceName || "your selected service"}</strong>.
                        {notes && <><br /><br /><strong>Additional notes:</strong> "{notes}"</>}<br /><br />
                        You will receive a reminder closer to the appointment date.
                    </p>
                    <div className="confirm-button-container">
                        <button className="confirm-button" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppointmentConfirmation;