import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Portal from "./Portal";

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
