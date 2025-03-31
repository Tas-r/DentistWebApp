import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Import CSS for styling
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Updated username icon

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const handleLogin = async (event) => {
      event.preventDefault();
  
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/users/login/",
          { username, password },
          { withCredentials: true }
        );

            console.log("Login successful:", response.data);
            // Store tokens
            localStorage.setItem("access", response.data.access || response.data.access_token);
            localStorage.setItem("refresh", response.data.refresh || response.data.refresh_token);


            // the oft imagined soft fade into the next page my beloved
            document.body.classList.add("fade-out");
            setTimeout(() => {
                navigate("/dashboard");
                document.body.classList.remove("fade-out");
            }, 500);

        } catch (err) {
            console.error("Login error:", err.response ? err.response.data : err);
            setError("Invalid username or password");
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - White Background with Centered Login Form */}
            <div className="login-left">
                <div className="login-form">
                    <h2>Log in to your Account</h2>
                    <p>Welcome back!</p>
                    
                    {error && <p className="error-message">{error}</p>}

                    <form onSubmit={handleLogin}>
                        {/* Username Input */}
                        <div className="input-group">
                            <FaUser className="icon" /> {/* Changed from FaEnvelope to FaUser */}
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <FaLock className="icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="options">
                            <label>
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="/forgot-password">Forgot Password?</a>
                        </div>

                        {/* Login Button */}
                        <button type="submit" className="login-button">Log in</button>
                    </form>
                </div>
            </div>

            {/* Right Side - Grey Background or Image */}
            <div className="login-right"></div>
        </div>
    );
}

export default Login;
