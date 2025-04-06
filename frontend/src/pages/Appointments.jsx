import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "../styles/Portal.css";
import "../styles/Appointments.css";
import { useNavigate } from "react-router-dom";

function Appointments() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [reasons, setReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState(null);
    const [notes, setNotes] = useState("");
    const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);

    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [loadingTimes, setLoadingTimes] = useState(false);

    const navigate = useNavigate();
    const stepsCompleted = selectedDoctor && selectedDate && selectedTime && selectedReason;

    const disableDates = ({ date }) => {
        return date < new Date() || date.getDay() === 0 || date.getDay() === 6;
    };

    useEffect(() => {
        const fetchDentists = async () => {
            try {
                const token = localStorage.getItem("access");
                const response = await axios.get("http://127.0.0.1:8000/users/dentists/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const formattedDoctors = response.data.map((doc) => {
                    const hasNames = doc.user.first_name || doc.user.last_name;
                    const name = hasNames ? `Dr. ${doc.user.first_name} ${doc.user.last_name}`.trim() : `Dr. ${doc.user.username}`;
                    const image = doc.profile_image?.startsWith("http") ? doc.profile_image : `http://127.0.0.1:8000${doc.profile_image}`;
                    return { id: doc.id, name, image };
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

        const fetchServices = async () => {
            try {
                const token = localStorage.getItem("access");
                const res = await axios.get("http://127.0.0.1:8000/appointments/services/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReasons(res.data);
            } catch (err) {
                console.error("Failed to fetch services:", err);
            }
        };

        fetchDentists();
        fetchServices();
    }, []);

    useEffect(() => {
        const fetchAvailableTimes = async () => {
            if (!selectedDoctor || !selectedDate) return;
            setLoadingTimes(true);
            try {
                const token = localStorage.getItem("access");
                const dateStr = selectedDate.toISOString().split("T")[0];
                const response = await axios.get(`http://127.0.0.1:8000/appointments/time-slots/?dentist_id=${selectedDoctor}&date=${dateStr}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAvailableTimes(response.data.available_slots);
            } catch (err) {
                console.error("Failed to fetch available times:", err);
                setAvailableTimes([]);
            } finally {
                setLoadingTimes(false);
            }
        };
        fetchAvailableTimes();
    }, [selectedDoctor, selectedDate]);

    const handleSubmit = async () => {
        if (appointmentSubmitted) return;
        try {
            const token = localStorage.getItem("access");
            const patientRes = await axios.get("http://127.0.0.1:8000/users/patients/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const patientId = patientRes.data[0]?.id;
            if (!patientId) {
                alert("Couldn't find your patient profile.");
                return;
            }
            const dateStr = selectedDate.toISOString().split("T")[0];
            const [hour, minute, modifier] = selectedTime.match(/(\d+):(\d+)\s?(am|pm)/i).slice(1);
            let hours = parseInt(hour);
            if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
            if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
            const timeStr = `${String(hours).padStart(2, '0')}:${minute}:00`;
            const appointmentDate = `${dateStr}T${timeStr}`;

            const payload = {
                patient_id: patientId,
                dentist_id: selectedDoctor,
                appointment_date: appointmentDate,
                service_ids: [selectedReason],
            };
            const res = await axios.post("http://127.0.0.1:8000/appointments/", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("✅ Appointment submitted:", res.data);
            setAppointmentSubmitted(true);
            navigate("/appointment-confirmation", { state: { dentist: selectedDoctor, date: dateStr, time: selectedTime, reason: selectedReason, notes } });
        } catch (err) {
            console.error("❌ Error submitting appointment:", err.response?.data || err.message || err);
            alert("Failed to submit appointment.");
        }
    };

    return (
        <div className="page-container">
            <Sidebar activePage="appointments" />
            <div className="content">
                <h1 className="page-title">Schedule an Appointment</h1>
                <div className="dashboard-sections">
                    <div className="card step">
                        <div className={`step-number ${selectedDoctor ? "completed" : ""}`}>{selectedDoctor ? "✔" : "1"}</div>
                        <h2>Select your dentist:</h2>
                        <p className="instruction-text">Choose your dentist:</p>
                        <div className="actions-grid">
                            {loadingDoctors ? <p>Loading dentists...</p> : doctors.map(doc => (
                                <button
                                    key={doc.id}
                                    className={`doctor-select-button ${selectedDoctor === doc.id ? "selected" : ""}`}
                                    onClick={() => setSelectedDoctor(doc.id)}
                                >
                                    <img src={doc.image} className="doctor-button-pic" alt={doc.name} />
                                    {doc.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card step">
                        <div className={`step-number ${selectedDate ? "completed" : ""}`}>{selectedDate ? "✔" : "2"}</div>
                        <h2>Select appointment date:</h2>
                        <p className="instruction-text">Pick a date:</p>
                        <Calendar onChange={setSelectedDate} value={selectedDate} tileDisabled={disableDates} />
                    </div>

                    <div className="card step">
                        <div className={`step-number ${selectedTime ? "completed" : ""}`}>{selectedTime ? "✔" : "3"}</div>
                        <h2>Select appointment time:</h2>
                        <p className="instruction-text">Choose a time:</p>
                        <div className="actions-grid times">
                            {loadingTimes ? <p>Loading available times...</p> : availableTimes.map(time => (
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

                    <div className="card step">
                        <div className={`step-number ${selectedReason ? "completed" : ""}`}>{selectedReason ? "✔" : "4"}</div>
                        <h2>Reason for visit:</h2>
                        <p className="instruction-text">Select one reason:</p>
                        <div className="actions-grid">
                            {reasons.map(reason => (
                                <button
                                    key={reason.id}
                                    className={`selectable-button ${selectedReason === reason.id ? "selected" : ""}`}
                                    onClick={() => setSelectedReason(reason.id)}
                                >
                                    {reason.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card step">
                        <div className={`step-number optional ${notes ? "completed" : ""}`}>{notes ? "✔" : "5"}</div>
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
                {stepsCompleted && !appointmentSubmitted && (
                    <div style={{ marginTop: "30px", textAlign: "center" }}>
                        <button className="confirm-button" onClick={handleSubmit}>Confirm Appointment</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Appointments;