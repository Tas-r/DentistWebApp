"use client"

import { useEffect, useState } from "react"
import PortalLayout from "../components/PortalLayout"

function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/users/documents/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch documents")
        }

        const data = await response.json()
        setDocuments(data)
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError("Failed to load your documents")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadError("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", file.name)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/users/documents/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload document")
      }

      const newDocument = await response.json()
      setDocuments((prev) => [...prev, newDocument])

      // Reset file input
      e.target.value = null
    } catch (err) {
      console.error("Error uploading document:", err)
      setUploadError(err.message || "Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (documentId, fileName) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/users/documents/${documentId}/download/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to download document")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error downloading document:", err)
      alert("Failed to download document")
    }
  }

  return (
    <PortalLayout>
      <h1 className="text-2xl font-bold mb-6">Your Documents</h1>

      <div className="card mb-6">
        <h2 className="card-title">Upload New Document</h2>

        {uploadError && <div className="alert alert-danger">{uploadError}</div>}

        <div className="flex items-center">
          <input type="file" id="document-upload" onChange={handleFileUpload} disabled={uploading} className="flex-1" />

          {uploading && <p className="ml-4">Uploading...</p>}
        </div>
      </div>

      {loading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : documents.length > 0 ? (
        <div className="card p-0 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id}>
                  <td>{document.name}</td>
                  <td>{new Date(document.uploaded_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDownload(document.id, document.name)}
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center">
          <p>You don't have any documents yet. Upload your first document using the form above.</p>
        </div>
      )}
    </PortalLayout>
  )
}

export default DocumentsPage

