import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getApiError, taskApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalTask, setModalTask] = useState(undefined);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("all");

  const loadTasks = useCallback(async () => {
    setLoading(true); setError("");
    try { const response = await taskApi.list(); setTasks(response.data.tasks || response.data || []); }
    catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const visibleTasks = useMemo(() => filter === "all" ? tasks : tasks.filter((task) => task.status === filter), [tasks, filter]);
  const completed = tasks.filter((task) => task.status === "completed").length;

  // Admins always use the dedicated admin dashboard.
  if (user?.role === "admin") return <Navigate to="/admin" replace />;

  const removeTask = async (task) => {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    try { await taskApi.remove(task.id); setTasks((current) => current.filter((item) => item.id !== task.id)); setToast("Task deleted successfully."); }
    catch (err) { setError(getApiError(err)); }
  };

  const saved = (savedTask) => {
    setTasks((current) => {
      const exists = current.some((task) => task.id === savedTask.id);
      return exists ? current.map((task) => task.id === savedTask.id ? savedTask : task) : [savedTask, ...current];
    });
    setModalTask(undefined); setToast("Task saved successfully.");
  };

  const signOut = () => { logout(); navigate("/login", { replace: true }); };

  return (
    <div className="app-shell sidebar-layout">
      <Sidebar user={user} onLogout={signOut} />
      <main className="dashboard-main page-with-sidebar">
        <section id="user-overview" className="hero-card"><div><p className="eyebrow light">Personal workspace</p><h1>Good to see you, {user?.name?.split(" ")[0] || "there"}.</h1><p>Keep your tasks clear, focused, and moving forward.</p></div><div className="hero-stats"><div><strong>{tasks.length}</strong><span>Total tasks</span></div><div><strong>{completed}</strong><span>Completed</span></div></div></section>
        <section id="user-tasks" className="content-section"><div className="section-heading"><div><p className="eyebrow">Your work</p><h2>My tasks</h2></div><button className="button button-primary" onClick={() => setModalTask(null)}>+ Create task</button></div>
          <div className="filter-row"><button className={filter === "all" ? "filter active" : "filter"} onClick={() => setFilter("all")}>All <span>{tasks.length}</span></button><button className={filter === "pending" ? "filter active" : "filter"} onClick={() => setFilter("pending")}>Pending <span>{tasks.length - completed}</span></button><button className={filter === "completed" ? "filter active" : "filter"} onClick={() => setFilter("completed")}>Completed <span>{completed}</span></button></div>
          {error && <Toast onClose={() => setError("")}>{error}</Toast>}
          {toast && <Toast type="success" onClose={() => setToast("")}>{toast}</Toast>}
          {loading ? <LoadingSpinner label="Loading your tasks..." /> : visibleTasks.length === 0 ? <div className="empty-card"><div className="empty-icon">✓</div><h3>{filter === "all" ? "No tasks yet" : `No ${filter} tasks`}</h3><p>{filter === "all" ? "Create your first task to get started." : "Try another filter or create a new task."}</p>{filter === "all" && <button className="button button-primary" onClick={() => setModalTask(null)}>Create your first task</button>}</div> : <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task.id} task={task} onEdit={setModalTask} onDelete={removeTask} />)}</div>}
        </section>
      </main>
      {modalTask !== undefined && <TaskModal task={modalTask || null} onClose={() => setModalTask(undefined)} onSaved={saved} />}
    </div>
  );
}
