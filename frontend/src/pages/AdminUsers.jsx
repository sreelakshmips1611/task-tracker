import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiError, userApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import Sidebar from "../components/Sidebar";

export default function AdminUsers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const response = await userApi.list(); setUsers(response.data.users || response.data || []); }
    catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const normalUsers = useMemo(() => users.filter((item) => item.role !== "admin"), [users]);
  const removeUser = async (target) => {
    if (target.id === user?.id) return setError("You cannot delete your own admin account.");
    if (!window.confirm(`Delete user “${target.name || target.email}”?`)) return;
    try { await userApi.remove(target.id); setUsers((current) => current.filter((item) => item.id !== target.id)); setToast("User deleted successfully."); }
    catch (err) { setError(getApiError(err)); }
  };
  const signOut = () => { logout(); navigate("/login", { replace: true }); };

  return <div className="app-shell sidebar-layout">
    <Sidebar user={user} admin onLogout={signOut} />
    <main className="dashboard-main page-with-sidebar">
      <section className="page-header-card">
        <div><p className="eyebrow light">User management</p><h1>All users</h1><p>Manage the regular users in the workspace.</p></div>
        <div className="hero-stats"><div><strong>{normalUsers.length}</strong><span>Users</span></div></div>
      </section>
      {error && <Toast onClose={() => setError("")}>{error}</Toast>}
      {toast && <Toast type="success" onClose={() => setToast("")}>{toast}</Toast>}
      {loading ? <LoadingSpinner label="Loading users..." /> : <section className="content-section"><div className="section-heading"><div><p className="eyebrow">User management</p><h2>Regular users</h2></div><span className="section-count">{normalUsers.length} users</span></div><div className="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Action</th></tr></thead><tbody>{normalUsers.map((item) => <tr key={item.id}><td><div className="table-user"><span className="avatar small">{(item.name || item.email || "U").charAt(0).toUpperCase()}</span><strong>{item.name || "Unnamed"}</strong></div></td><td>{item.email}</td><td><span className="role-badge user">User</span></td><td><button className="text-button danger" onClick={() => removeUser(item)}>Delete</button></td></tr>)}</tbody></table>{normalUsers.length === 0 && <div className="empty-table">No regular users found.</div>}</div></section>}
    </main>
  </div>;
}
