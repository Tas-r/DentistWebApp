import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // import useNavigate for redirection

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // get the navigate function

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username,
                password,
            });
            console.log("login successful, tokens received:", response.data);
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            alert("login successful!");
            navigate("/portal");
        } catch (err) {
            console.error("login error:", err.response ? err.response.data : err);
            setError("invalid username or password");
        }
    };
    

    return (
        <div>
            <h2>login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;
