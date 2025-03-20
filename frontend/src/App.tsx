import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/LoginForm';
import AppointmentList from './components/AppointmentList';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const accessToken = localStorage.getItem('access');
  
  if (!accessToken) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <AppointmentList />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/appointments" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;