import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Icon = ({ name }) => {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    tasks: <><path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="m3.5 6 .8.8L6 5"/><path d="m3.5 12 .8.8L6 11"/><path d="m3.5 18 .8.8L6 17"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-6"/></>,
    menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
    close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

export default function Sidebar({ user, admin = false, onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = user?.name?.split(" ")[0] || (admin ? "Admin" : "User");
  const go = (path) => { setOpen(false); navigate(path); };
  const is = (path) => location.pathname === path;

  return <>
    <button className="mobile-menu-button" aria-label="Open navigation" onClick={() => setOpen(true)}><Icon name="menu" /></button>
    {open && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand"><span className="brand-icon">✓</span><div><strong>Task Tracker</strong>{admin && <span className="sidebar-role">Admin</span>}</div><button className="sidebar-close" aria-label="Close navigation" onClick={() => setOpen(false)}><Icon name="close" /></button></div>
      <div className="sidebar-section-label">Workspace</div>
      <nav className="sidebar-nav">
        <button className={`sidebar-link ${is(admin ? "/admin" : "/dashboard") ? "active" : ""}`} onClick={() => go(admin ? "/admin" : "/dashboard")}><Icon name="grid"/><span>{admin ? "Overview" : "Dashboard"}</span></button>
        <button className={`sidebar-link ${is(admin ? "/admin/tasks" : "/dashboard") ? "active" : ""}`} onClick={() => go(admin ? "/admin/tasks" : "/dashboard")}><Icon name="tasks"/><span>{admin ? "All tasks" : "My tasks"}</span></button>
        {admin && <button className={`sidebar-link ${is("/admin/users") ? "active" : ""}`} onClick={() => go("/admin/users")}><Icon name="users"/><span>All users</span></button>}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-profile"><span className={`sidebar-avatar ${admin ? "admin" : ""}`}>{firstName.charAt(0).toUpperCase()}</span><div className="sidebar-profile-copy"><strong>{user?.name || (admin ? "Admin" : "User")}</strong><span>{user?.email || ""}</span></div></div>
      <button className="sidebar-logout" onClick={onLogout}><Icon name="logout"/><span>Logout</span></button>
    </aside>
  </>;
}
