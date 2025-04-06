import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Appointments from "./pages/Appointments";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import Documents from "./pages/Documents";
import Messaging from "./pages/Messaging";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route wrapper */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointment-confirmation" element={<AppointmentConfirmation />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/inbox" element={<Messaging />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;