import React, { useState, useEffect } from "react";
import axios from "axios";

function Portal() {
    const [dentists, setDentists] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access"); // get stored token
        console.log("using token:", token); // log token to console
        
        axios.get("http://127.0.0.1:8000/api/dentists/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("dentist data received:", response.data);
            setDentists(response.data);
        })
        .catch(error => console.error("error fetching dentists:", error));
    }, []);
    
    return (
        <div>
            <h1>portal</h1>
            <ul>
                {dentists.map(d => (
                <li key={d.id}>
                    {d.username} - {d.role ? d.role : "Unknown Specialty"}
        </li>
    ))}
</ul>

        </div>
    );
}


export default Portal;
