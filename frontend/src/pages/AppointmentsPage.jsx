"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PortalLayout from "../components/PortalLayout"

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/appointments/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }

        const data = await response.json()
        setAppointments(data)
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError("Failed to load your appointments")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  return (
    <PortalLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Appointments</h1>
        <Link to="/appointments/new" className="btn">
          New Appointment
        </Link>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : appointments.length > 0 ? (
        <div className="card p-0 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.doctor.name}</td>
                  <td>{appointment.reason}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <Link to={`/appointments/${appointment.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center">
          <p className="mb-4">You don't have any appointments yet.</p>
          <Link to="/appointments/new" className="btn">
            Schedule Your First Appointment
          </Link>
        </div>
      )}
    </PortalLayout>
  )
}

export default AppointmentsPage

