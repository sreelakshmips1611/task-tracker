import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiError, taskApi, userApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const [u, t] = await Promise.all([userApi.list(), taskApi.list()]); setUsers(u.data.users || u.data || []); setTasks(t.data.tasks || t.data || []); }
    catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const normalUsers = users.filter((item) => item.role !== "admin");
  const signOut = () => { logout(); navigate("/login", { replace: true }); };

  return <div className="app-shell sidebar-layout">
    <Sidebar user={user} admin onLogout={signOut} />
    <main className="dashboard-main page-with-sidebar">
      <section className="hero-card admin-hero">
        <div><p className="eyebrow light">Administration</p><h1>Workspace overview</h1><p>Review your workspace from one place.</p></div>
        <div className="hero-stats"><div><strong>{normalUsers.length}</strong><span>Users</span></div><div><strong>{tasks.length}</strong><span>All tasks</span></div></div>
      </section>
      {error && <Toast onClose={() => setError("")}>{error}</Toast>}
      {loading ? <LoadingSpinner label="Loading workspace..." /> : <section className="content-section admin-overview-grid"><button className="admin-nav-card" onClick={() => navigate("/admin/tasks")}><span className="admin-nav-icon">☑</span><div><p className="eyebrow">Workspace activity</p><h2>All tasks</h2><p>View and manage every task, including its owner.</p></div><span className="admin-nav-arrow">→</span></button><button className="admin-nav-card" onClick={() => navigate("/admin/users")}><span className="admin-nav-icon">♙</span><div><p className="eyebrow">User management</p><h2>All users</h2><p>View and manage regular users. Admin accounts are excluded.</p></div><span className="admin-nav-arrow">→</span></button></section>}
    </main>
  </div>;
}
