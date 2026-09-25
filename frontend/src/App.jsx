import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTasks from "./pages/AdminTasks";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import "./App.css";

function RoleRedirect() {
  const { user, authenticated } = useAuth();
  if (!authenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
}

function App() {
  return <AuthProvider><BrowserRouter><Routes><Route path="/" element={<RoleRedirect />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />} /><Route element={<AdminRoute />}><Route path="/admin" element={<AdminDashboard />} /><Route path="/admin/tasks" element={<AdminTasks />} /><Route path="/admin/users" element={<AdminUsers />} /></Route></Route><Route path="*" element={<NotFound />} /></Routes></BrowserRouter></AuthProvider>;
}
export default App;
