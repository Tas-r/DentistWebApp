import { Navigate, Outlet } from "react-router-dom";

// utility to check token validity
function isTokenValid() {
  const token = localStorage.getItem("access");
  if (!token) return false;

  // decode JWT (basic way)
  const payload = JSON.parse(atob(token.split(".")[1]));
  const now = Math.floor(Date.now() / 1000);

  return payload.exp > now;
}

function PrivateRoute() {
  return isTokenValid() ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
