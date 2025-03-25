"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "./Sidebar"

export default function PortalLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
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

        setLoading(false)
      } catch (err) {
        console.error("Token verification failed:", err)
        localStorage.removeItem("token")
        router.push("/login")
      }
    }

    verifyToken()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4">{children}</main>
    </div>
  )
}

