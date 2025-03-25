"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token")
    // Redirect to landing page
    navigate("/")
  }

  // Navigation items
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Appointments", path: "/appointments" },
    { name: "Documents", path: "/documents" },
    { name: "Messages", path: "/messages" },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button className="md:hidden fixed top-4 left-4 z-20 p-2 bg-gray-200 rounded" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out z-10 w-64 bg-gray-100 p-4 overflow-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Dental Clinic Portal</h1>
          </div>

          <nav className="flex-grow">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block p-2 rounded ${
                      location.pathname === item.path ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-4">
            <button
              onClick={handleLogout}
              className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar

