import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Portal.css";
import "../styles/Appointments.css";

function Appointments() {
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState("");

    const stepsCompleted = selectedDoctor && selectedDate && selectedTime && selectedServiceId;

    const disableDates = ({ date }) => {
        return date < new Date() || date.getDay() === 0 || date.getDay() === 6;
    };

    useEffect(() => {
        const token = localStorage.getItem("access");

        const fetchDentists = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/appointments/dentists/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const formatted = res.data.map((doc) => ({
                    id: doc.id,
                    name: `Dr. ${doc.user.first_name} ${doc.user.last_name}`,
                    image: "/default-doctor.png",
                }));

                setDoctors(formatted);
            } catch (err) {
                console.warn("Dentist fetch failed, using fallback.");
                setDoctors([
                    { id: 1, name: "Dr. Fallback One", image: "/default-doctor.png" },
                ]);
            }
        };

        const fetchServices = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/appointments/services/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setServices(res.data);
            } catch (err) {
                console.error("Could not fetch services:", err);
            }
        };

        fetchDentists();
        fetchServices();
    }, []);

    useEffect(() => {
        const fetchAvailableTimes = async () => {
            if (!selectedDoctor || !selectedDate) return;

            const dateStr = selectedDate.toISOString().split("T")[0];
            try {
                const token = localStorage.getItem("access");
                const res = await axios.get(
                    `http://127.0.0.1:8000/appointments/time-slots/?dentist_id=${selectedDoctor}&date=${dateStr}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setAvailableTimes(res.data.available_slots || []);
            } catch (err) {
                console.error("Error fetching time slots:", err);
                setAvailableTimes([]);
            }
        };

        fetchAvailableTimes();
    }, [selectedDoctor, selectedDate]);

    const handleConfirm = async () => {
        if (!stepsCompleted) return;

        const token = localStorage.getItem("access");

        // Format datetime
        const timeObj = new Date(selectedDate);
        const [hour, minutePart] = selectedTime.split(":");
        const [minute, meridiem] = minutePart.split(" ");
        let hour24 = parseInt(hour, 10);
        if (meridiem.toLowerCase() === "pm" && hour24 !== 12) hour24 += 12;
        if (meridiem.toLowerCase() === "am" && hour24 === 12) hour24 = 0;
        timeObj.setHours(hour24, parseInt(minute, 10));

        const appointmentData = {
            appointment_date: timeObj.toISOString().slice(0, 16).replace("T", " "),
            dentist_id: selectedDoctor,
            service_ids: [selectedServiceId],
            notes: notes || "",
        };

        try {
            await axios.post("http://127.0.0.1:8000/appointments/", appointmentData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage("✅ Appointment successfully scheduled!");
            setSelectedDoctor(null);
            setSelectedDate(null);
            setSelectedTime("");
            setSelectedServiceId(null);
            setNotes("");
        } catch (error) {
            if (error.response) {
                console.error("Backend error:", error.response.data);
            } else {
                console.error("Network error:", error);
            }
            setMessage("❌ Failed to schedule appointment.");
        }
    };

    return (
        <div className="page-container">
            <Sidebar activePage="appointments" />
            <div className="content">
                <h1 className="page-title">Schedule an Appointment</h1>
                <div className="dashboard-sections">

                    {/* Dentist */}
                    <div className="card step">
                        <div className={`step-number ${selectedDoctor ? "completed" : ""}`}>
                            {selectedDoctor ? "✔" : "1"}
                        </div>
                        <h2>Select your dentist:</h2>
                        <div className="actions-grid">
                            {doctors.map((doc) => (
                                <button
                                    key={doc.id}
                                    className={`doctor-select-button ${selectedDoctor === doc.id ? "selected" : ""}`}
                                    onClick={() => {
                                        setSelectedDoctor(doc.id);
                                        setSelectedTime("");
                                    }}
                                >
                                    <img src={doc.image} className="doctor-button-pic" alt={doc.name} />
                                    {doc.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="card step">
                        <div className={`step-number ${selectedDate ? "completed" : ""}`}>
                            {selectedDate ? "✔" : "2"}
                        </div>
                        <h2>Select appointment date:</h2>
                        <Calendar
                            onChange={(date) => {
                                setSelectedDate(date);
                                setSelectedTime("");
                            }}
                            value={selectedDate}
                            tileDisabled={disableDates}
                        />
                    </div>

                    {/* Time */}
                    <div className="card step">
                        <div className={`step-number ${selectedTime ? "completed" : ""}`}>
                            {selectedTime ? "✔" : "3"}
                        </div>
                        <h2>Select appointment time:</h2>
                        {availableTimes.length === 0 && <p>No available times — pick a date and doctor</p>}
                        <div className="actions-grid times">
                            {availableTimes.map((time) => (
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

                    {/* Reason (Services) */}
                    <div className="card step">
                        <div className={`step-number ${selectedServiceId ? "completed" : ""}`}>
                            {selectedServiceId ? "✔" : "4"}
                        </div>
                        <h2>Reason for visit:</h2>
                        <div className="actions-grid">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    className={`selectable-button ${selectedServiceId === service.id ? "selected" : ""}`}
                                    onClick={() => setSelectedServiceId(service.id)}
                                >
                                    {service.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="card step">
                        <div className={`step-number optional ${notes ? "completed" : ""}`}>
                            {notes ? "✔" : "5"}
                        </div>
                        <h2>Additional notes <span className="optional-text">(Optional)</span></h2>
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
                        <button className="confirm-button" onClick={handleConfirm}>
                            Confirm Appointment
                        </button>
                    </div>
                )}

                {message && <p className="feedback-message">{message}</p>}
            </div>
        </div>
    );
}

export default Appointments;
