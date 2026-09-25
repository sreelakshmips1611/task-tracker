export default function TaskCard({ task, onEdit, onDelete, admin = false, ownerName }) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <div className="task-title-wrap">
          <span className={`task-dot ${task.status}`} />
          <div>
            <h3>{task.title}</h3>
            <p>{task.description || "No description added."}</p>{admin && ownerName && <div className="task-owner"><span className="owner-avatar">{ownerName.charAt(0).toUpperCase()}</span><span>Owner: <strong>{ownerName}</strong></span></div>}
          </div>
        </div>
        <span className={`status-badge ${task.status}`}>{task.status}</span>
      </div>
      <div className="task-card-bottom">
        <span className="task-meta">{task.created_at ? new Date(task.created_at).toLocaleDateString() : "Recently created"}</span>
        <div className="task-actions">
          <button className="text-button" onClick={() => onEdit(task)}>Edit</button>
          <button className="text-button danger" onClick={() => onDelete(task)}>{admin ? "Delete" : "Delete"}</button>
        </div>
      </div>
    </article>
  );
}
