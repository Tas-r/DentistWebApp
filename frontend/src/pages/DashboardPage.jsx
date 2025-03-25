"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PortalLayout from "../components/PortalLayout"

function DashboardPage() {
  const [upcomingAppointment, setUpcomingAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUpcomingAppointment = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/appointments/upcoming/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            // No upcoming appointment
            setUpcomingAppointment(null)
            return
          }
          throw new Error("Failed to fetch upcoming appointment")
        }

        const data = await response.json()
        setUpcomingAppointment(data)
      } catch (err) {
        console.error("Error fetching appointment:", err)
        setError("Failed to load your upcoming appointment")
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingAppointment()
  }, [])

  return (
    <PortalLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Appointment Card */}
        <div className="card">
          <h2 className="card-title">Your Upcoming Appointment</h2>

          {loading ? (
            <p>Loading appointment information...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : upcomingAppointment ? (
            <div>
              <p className="mb-2">
                <strong>Date:</strong> {new Date(upcomingAppointment.date).toLocaleDateString()}
              </p>
              <p className="mb-2">
                <strong>Time:</strong> {upcomingAppointment.time}
              </p>
              <p className="mb-2">
                <strong>Doctor:</strong> {upcomingAppointment.doctor.name}
              </p>
              <p className="mb-2">
                <strong>Reason:</strong> {upcomingAppointment.reason}
              </p>
              <Link to={`/appointments/${upcomingAppointment.id}`} className="btn mt-4 inline-block">
                View Details
              </Link>
            </div>
          ) : (
            <div>
              <p>You don't have any upcoming appointments.</p>
              <Link to="/appointments/new" className="btn mt-4 inline-block">
                Schedule an Appointment
              </Link>
            </div>
          )}
        </div>

        {/* Quick Links Card */}
        <div className="card">
          <h2 className="card-title">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/appointments" className="text-blue-600 hover:underline">
                View All Appointments
              </Link>
            </li>
            <li>
              <Link to="/documents" className="text-blue-600 hover:underline">
                Manage Documents
              </Link>
            </li>
            <li>
              <Link to="/messages" className="text-blue-600 hover:underline">
                Message Your Provider
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </PortalLayout>
  )
}

export default DashboardPage

