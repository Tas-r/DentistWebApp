import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "../styles/Portal.css";
import "../styles/Appointments.css";

function Appointments() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedReason, setSelectedReason] = useState("");
    const [notes, setNotes] = useState("");

    const [loadingDoctors, setLoadingDoctors] = useState(true);

    const times = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM"];

    const reasons = [
        "Routine Check-up and Cleaning",
        "Tooth Pain and Sensitivity",
        "Fillings, Crowns, or Repairs",
        "Whitening or Cosmetic Consultation",
        "Orthodontics Consultation",
        "Emergency Dental Care",
        "Gum Treatment",
        "Follow-up Appointment",
    ];

    const stepsCompleted = selectedDoctor && selectedDate && selectedTime && selectedReason;

    const disableDates = ({ date }) => {
        return date < new Date() || date.getDay() === 0 || date.getDay() === 6;
    };

    useEffect(() => {
        const fetchDentists = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get("http://127.0.0.1:8000/users/dentists/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                console.log("✅ Got dentist response:", response.data);
        
                const formattedDoctors = response.data.map((doc) => {
                    const hasNames = doc.user.first_name || doc.user.last_name;
                    const name = hasNames
                        ? `Dr. ${doc.user.first_name} ${doc.user.last_name}`.trim()
                        : `Dr. ${doc.user.username}`;
        
                    const image = doc.profile_image?.startsWith("http")
                        ? doc.profile_image
                        : `http://127.0.0.1:8000${doc.profile_image}`;
        
                    return {
                        id: doc.id,
                        name,
                        image,
                    };
                });
        
                setDoctors(formattedDoctors);
            } catch (error) {
                console.warn("❌ Couldn't fetch dentists — using fallback.");
                setDoctors([
                    { id: 1, name: "Dr. Fallback One", image: "/default-doctor.png" },
                    { id: 2, name: "Dr. Fallback Two", image: "/default-doctor.png" },
                ]);
            } finally {
                setLoadingDoctors(false);
            }
        };        

        fetchDentists();
    }, []);

    return (
        <div className="page-container">
            <Sidebar activePage="appointments" />
            <div className="content">
                <h1 className="page-title">Schedule an Appointment</h1>
                <div className="dashboard-sections">

                    {/* Doctor Selection */}
                    <div className="card step">
                        <div className={`step-number ${selectedDoctor ? "completed" : ""}`}>
                            {selectedDoctor ? "✔" : "1"}
                        </div>
                        <h2>Select your dentist:</h2>
                        <p className="instruction-text">Choose your dentist:</p>
                        <div className="actions-grid">
                            {loadingDoctors ? (
                                <p>Loading dentists...</p>
                            ) : (
                                doctors.map(doc => (
                                    <button
                                        key={doc.id}
                                        className={`doctor-select-button ${selectedDoctor === doc.id ? "selected" : ""}`}
                                        onClick={() => setSelectedDoctor(doc.id)}
                                    >
                                        <img src={doc.image} className="doctor-button-pic" alt={doc.name} />
                                        {doc.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Appointment Date Selection */}
                    <div className="card step">
                        <div className={`step-number ${selectedDate ? "completed" : ""}`}>
                            {selectedDate ? "✔" : "2"}
                        </div>
                        <h2>Select appointment date:</h2>
                        <p className="instruction-text">Pick a date:</p>
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileDisabled={disableDates}
                        />
                    </div>

                    {/* Appointment Time Selection */}
                    <div className="card step">
                        <div className={`step-number ${selectedTime ? "completed" : ""}`}>
                            {selectedTime ? "✔" : "3"}
                        </div>
                        <h2>Select appointment time:</h2>
                        <p className="instruction-text">Choose a time:</p>
                        <div className="actions-grid times">
                            {times.map(time => (
                                <button
                                    key={time}
                                    className={`selectable-button ${selectedTime === time ? "selected" : ""}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reason for Visit */}
                    <div className="card step">
                        <div className={`step-number ${selectedReason ? "completed" : ""}`}>
                            {selectedReason ? "✔" : "4"}
                        </div>
                        <h2>Reason for visit:</h2>
                        <p className="instruction-text">Select one reason:</p>
                        <div className="actions-grid">
                            {reasons.map(reason => (
                                <button
                                    key={reason}
                                    className={`selectable-button ${selectedReason === reason ? "selected" : ""}`}
                                    onClick={() => setSelectedReason(reason)}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="card step">
                        <div className={`step-number optional ${notes ? "completed" : ""}`}>
                            {notes ? "✔" : "5"}
                        </div>
                        <h2>Additional notes <span className="optional-text">(Optional)</span></h2>
                        <p className="instruction-text">Special requests?</p>
                        <textarea
                            className="notes-input modern-textarea"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter notes here..."
                        />
                    </div>

                </div>

                {stepsCompleted && (
                    <div className="confirm-button-container">
                        <button className="confirm-button">Confirm Appointment</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Appointments;
