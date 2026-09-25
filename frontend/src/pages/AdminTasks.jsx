import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiError, taskApi, userApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import Sidebar from "../components/Sidebar";

export default function AdminTasks() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalTask, setModalTask] = useState(undefined);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [usersResponse, tasksResponse] = await Promise.all([userApi.list(), taskApi.list()]);
      setUsers(usersResponse.data.users || usersResponse.data || []);
      setTasks(tasksResponse.data.tasks || tasksResponse.data || []);
    } catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const userById = useMemo(() => Object.fromEntries(users.map((item) => [item.id, item])), [users]);

  const removeTask = async (task) => {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    try { await taskApi.remove(task.id); setTasks((current) => current.filter((item) => item.id !== task.id)); setToast("Task deleted successfully."); }
    catch (err) { setError(getApiError(err)); }
  };

  const saved = (task) => {
    setTasks((current) => current.map((item) => item.id === task.id ? task : item));
    setModalTask(undefined); setToast("Task updated successfully.");
  };

  const signOut = () => { logout(); navigate("/login", { replace: true }); };

  return <div className="app-shell sidebar-layout">
    <Sidebar user={user} admin onLogout={signOut} />
    <main className="dashboard-main page-with-sidebar">
      <section className="page-header-card">
        <div><p className="eyebrow light">Workspace activity</p><h1>All tasks</h1><p>Review and manage every task across the workspace.</p></div>
        <div className="hero-stats"><div><strong>{tasks.length}</strong><span>All tasks</span></div><div><strong>{tasks.filter((t) => t.status === "completed").length}</strong><span>Completed</span></div></div>
      </section>
      {error && <Toast onClose={() => setError("")}>{error}</Toast>}
      {toast && <Toast type="success" onClose={() => setToast("")}>{toast}</Toast>}
      {loading ? <LoadingSpinner label="Loading all tasks..." /> : tasks.length === 0 ? <div className="empty-card"><div className="empty-icon">✓</div><h3>No tasks found</h3><p>There are no tasks in the workspace yet.</p></div> : <section className="content-section"><div className="section-heading"><div><p className="eyebrow">Workspace activity</p><h2>Task list</h2></div><span className="section-count">{tasks.length} tasks</span></div><div className="task-list">{tasks.map((task) => <TaskCard key={task.id} task={task} admin ownerName={userById[task.user_id ?? task.userId]?.name || "Unknown user"} onEdit={setModalTask} onDelete={removeTask} />)}</div></section>}
    </main>
    {modalTask && <TaskModal task={modalTask} onClose={() => setModalTask(undefined)} onSaved={saved} />}
  </div>;
}
