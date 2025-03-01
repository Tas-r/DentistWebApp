import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Portal from "./Portal";  // ✅ make sure this matches `Portal.js`

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/portal" element={<Portal />} />
            </Routes>
        </Router>
    );
}

export default App;
