"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import PortalLayout from "@/components/PortalLayout"

export default function AppointmentDetailPage() {
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelling, setCancelling] = useState(false)
  const params = useParams()
  const router = useRouter()
  const appointmentId = params.id

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:8000/appointments/${appointmentId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch appointment details")
        }

        const data = await response.json()
        setAppointment(data)
      } catch (err) {
        console.error("Error fetching appointment:", err)
        setError("Failed to load appointment details")
      } finally {
        setLoading(false)
      }
    }

    if (appointmentId) {
      fetchAppointment()
    }
  }, [appointmentId])

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    setCancelling(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/appointments/${appointmentId}/cancel/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to cancel appointment")
      }

      // Redirect to appointments page
      router.push("/appointments")
    } catch (err) {
      console.error("Error cancelling appointment:", err)
      alert("Failed to cancel appointment")
    } finally {
      setCancelling(false)
    }
  }

  return (
    <PortalLayout>
      <h1 className="text-2xl font-bold mb-6">Appointment Details</h1>

      {loading ? (
        <p>Loading appointment details...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : appointment ? (
        <div className="bg-white p-6 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Appointment Information</h2>
              <p className="mb-2">
                <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p className="mb-2">
                <strong>Time:</strong> {appointment.time}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {appointment.status}
              </p>
              <p className="mb-2">
                <strong>Reason:</strong> {appointment.reason}
              </p>

              {appointment.status === "scheduled" && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-red-300"
                >
                  {cancelling ? "Cancelling..." : "Cancel Appointment"}
                </button>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Doctor Information</h2>
              <p className="mb-2">
                <strong>Name:</strong> {appointment.doctor.name}
              </p>
              <p className="mb-2">
                <strong>Specialty:</strong> {appointment.doctor.specialty}
              </p>

              <h2 className="text-xl font-semibold mt-6 mb-4">Service Information</h2>
              <p className="mb-2">
                <strong>Service:</strong> {appointment.service.name}
              </p>
              <p className="mb-2">
                <strong>Price:</strong> ${appointment.service.price}
              </p>
              <p className="mb-2">
                <strong>Duration:</strong> {appointment.service.duration} minutes
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p>Appointment not found</p>
      )}
    </PortalLayout>
  )
}

