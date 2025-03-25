"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PortalLayout from "@/components/PortalLayout"

export default function NewAppointmentPage() {
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    doctor: "",
    service: "",
    date: "",
    time: "",
    reason: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        // Fetch doctors
        const doctorsResponse = await fetch("http://localhost:8000/appointments/doctors/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!doctorsResponse.ok) {
          throw new Error("Failed to fetch doctors")
        }

        const doctorsData = await doctorsResponse.json()
        setDoctors(doctorsData)

        // Fetch services
        const servicesResponse = await fetch("http://localhost:8000/appointments/services/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch services")
        }

        const servicesData = await servicesResponse.json()
        setServices(servicesData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load doctors and services")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/appointments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create appointment")
      }

      // Redirect to appointments page
      router.push("/appointments")
    } catch (err) {
      console.error("Error creating appointment:", err)
      setError(err.message || "Failed to create appointment")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PortalLayout>
      <h1 className="text-2xl font-bold mb-6">Schedule New Appointment</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="doctor">
                Select Doctor
              </label>
              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="service">
                Select Service
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Select a Service --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="time">
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="reason">
                Reason for Visit
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {submitting ? "Scheduling..." : "Schedule Appointment"}
            </button>
          </form>
        </div>
      )}
    </PortalLayout>
  )
}

