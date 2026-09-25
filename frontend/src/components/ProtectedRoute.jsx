import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { authenticated } = useAuth();
  const location = useLocation();
  return authenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
