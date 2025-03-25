"use client"

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

// This component wraps protected routes and checks for authentication
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    // Verify token validity (optional)
    const verifyToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/verify-token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Invalid token")
        }

        setIsAuthenticated(true)
      } catch (err) {
        console.error("Token verification failed:", err)
        localStorage.removeItem("token")
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

