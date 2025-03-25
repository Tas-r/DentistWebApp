"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import PortalLayout from "@/components/PortalLayout"

export default function AppointmentsPage() {
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
        <Link
          href="/appointments/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          New Appointment
        </Link>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : appointments.length > 0 ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(appointment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.doctor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/appointments/${appointment.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="mb-4">You don't have any appointments yet.</p>
          <Link
            href="/appointments/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Schedule Your First Appointment
          </Link>
        </div>
      )}
    </PortalLayout>
  )
}

