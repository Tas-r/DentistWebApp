import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";

function Messaging() {
    const [messages, setMessages] = useState([]);
    
    // Fetch unread messages (inbox)
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("access");
            const response = await axios.get("http://127.0.0.1:8000/messaging/inbox/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        }
    };

    return (
        <div className="page-container">
            <Sidebar activePage="messaging" />
            <div className="dashboard-content">
                <h1 className="page-title">Inbox</h1>
                <div className="dashboard-sections">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <div key={msg.id} className="card">
                                <h3>{msg.subject}</h3>
                                <p>{msg.body}</p>
                                <p><b>From:</b> {msg.sender.username}</p>
                                <p><b>Received:</b> {new Date(msg.created_at).toLocaleDateString()}</p>
                                <a href={`/messages/${msg.id}`} className="link">View Message</a>
                            </div>
                        ))
                    ) : (
                        <p>No new messages.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messaging;
