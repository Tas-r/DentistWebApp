import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Appointments from "./pages/Appointments";

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
          <Route path="/documents" element={<Document />} />
          <Route path="/inbox" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;