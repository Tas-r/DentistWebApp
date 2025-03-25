import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import AppointmentsPage from "./pages/AppointmentsPage"
import AppointmentDetailPage from "./pages/AppointmentDetailPage"
import NewAppointmentPage from "./pages/NewAppointmentPage"
import DocumentsPage from "./pages/DocumentsPage"
import MessagesPage from "./pages/MessagesPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/:id"
        element={
          <ProtectedRoute>
            <AppointmentDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments/new"
        element={
          <ProtectedRoute>
            <NewAppointmentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

