import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Portal.css";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem("access");
            console.log("🔐 Token in fetchDocuments:", token);
            const res = await axios.get("http://127.0.0.1:8000/documents/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("📂 Documents returned from backend:", res.data);
            setDocuments(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch documents:", err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !description) return alert("Please fill out all fields.");

        const formData = new FormData();
        formData.append("description", description);
        formData.append("document_file", file);

        try {
            const token = localStorage.getItem("access");
            console.log("🔐 Upload Token:", token);
            console.log("📄 Upload File:", file);
            console.log("📝 Upload Description:", description);
            await axios.post("http://127.0.0.1:8000/documents/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setDescription("");
            setFile(null);
            fetchDocuments();
        } catch (err) {
            console.error("❌ Upload failed:", err);
            alert("Upload failed. Make sure the file is a PDF under 5MB and you're logged in as a patient.");
        }
    };

    return (
        <div className="page-container">
            <Sidebar activePage="documents" />
            <div className="dashboard-content">
                <h1 className="page-title">My Documents</h1>

                <div className="dashboard-sections">
                    <div className="card" style={{ padding: "20px", justifyContent: "flex-start", alignItems: "flex-start" }}>
                        <h2 style={{ marginBottom: "10px" }}>Upload a Document</h2>
                        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter a short description"
                                className="modern-textarea"
                                style={{ padding: "8px 12px", fontSize: "16px", height: "auto" }}
                            />
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{ fontSize: "16px" }}
                            />
                            <button type="submit" className="confirm-button" style={{ marginTop: "10px" }}>Upload</button>
                        </form>
                    </div>

                    {documents.length > 0 ? (
                        documents.map((doc) => (
                            <div className="card" key={doc.id}>
                                <h3 style={{ marginBottom: "10px" }}>{doc.description}</h3>
                                <p style={{ marginBottom: "10px" }}><b>Uploaded:</b> {new Date(doc.upload_date).toLocaleDateString()}</p>
                                <a
                                    href={`http://127.0.0.1:8000${doc.document_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link"
                                >
                                    View Document
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>No documents uploaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Documents;
