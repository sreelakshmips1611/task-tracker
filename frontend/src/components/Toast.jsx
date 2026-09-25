export default function Toast({ type = "error", children, onClose }) {
  return (
    <div className={`toast toast-${type}`} role={type === "error" ? "alert" : "status"}>
      <span>{children}</span>
      {onClose && <button className="toast-close" onClick={onClose} aria-label="Close message">×</button>}
    </div>
  );
}
