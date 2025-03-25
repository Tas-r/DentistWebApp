"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function LandingPage() {
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Dental Clinic Portal</h1>
      <p className="mb-8 text-center max-w-md">
        Access your appointments, documents, and communicate with your healthcare providers.
      </p>
      <button onClick={handleLogin} className="btn">
        Login to Portal
      </button>
    </div>
  )
}

export default LandingPage

