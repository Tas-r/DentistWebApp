import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./Portal.css";
import "./Appointments.css";

function Appointments() {
    const doctors = [
        { id: 1, name: "Dr. Alice Smith", image: "/default-doctor.png" },
        { id: 2, name: "Dr. Bob Johnson", image: "/default-doctor.png" },
        { id: 3, name: "Dr. Carol Lee", image: "/default-doctor.png" },
    ];

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

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedReason, setSelectedReason] = useState("");
    const [notes, setNotes] = useState("");

    const stepsCompleted = selectedDoctor && selectedDate && selectedTime && selectedReason;

    const disableDates = ({ date }) => {
        return date < new Date() || date.getDay() === 0 || date.getDay() === 6;
    };

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
                            {doctors.map(doc => (
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

                    {/* Step 4: Reason for Visit */}
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


                    {/* Additional Notes (Optional) */}
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
