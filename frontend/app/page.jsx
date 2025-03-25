"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Dental Clinic Portal</h1>
      <p className="mb-8 text-center max-w-md">
        Access your appointments, documents, and communicate with your healthcare providers.
      </p>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Login to Portal
      </button>
    </div>
  )
}

