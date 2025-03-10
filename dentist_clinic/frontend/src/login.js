import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./index.css"; 

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username,
                password,
            });
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            navigate("/portal");
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-content">
                    <h2>Log in to your Account</h2>
                    <p>Welcome back!</p>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <FaEnvelope className="icon" />
                            <input 
                                type="text" 
                                placeholder="Email" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div className="input-group">
                            <FaLock className="icon" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <div className="options">
                            <label>
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="/forgot-password">Forgot Password?</a>
                        </div>
                        <button type="submit">Log in</button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
            </div>
            <div className="login-background"></div>
        </div>
    );
}

export default Login;
