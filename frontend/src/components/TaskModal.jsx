import { useEffect, useState } from "react";
import { getApiError, taskApi } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

const emptyTask = { title: "", description: "", status: "pending" };

export default function TaskModal({ task, onClose, onSaved }) {
  const [form, setForm] = useState(task ? { title: task.title || "", description: task.description || "", status: task.status || "pending" } : emptyTask);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(task ? { title: task.title || "", description: task.description || "", status: task.status || "pending" } : emptyTask);
  }, [task]);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (form.title.trim().length > 120) next.title = "Title must be 120 characters or fewer.";
    if (!['pending', 'completed'].includes(form.status)) next.status = "Choose a valid status.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSaving(true);
    try {
      const response = task
        ? await taskApi.update(task.id, form)
        : await taskApi.create(form);
      onSaved(response.data.task || response.data);
    } catch (error) {
      setServerError(getApiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Task management</p>
            <h2 id="task-modal-title">{task ? "Edit task" : "Create a task"}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">×</button>
        </div>
        {serverError && <div className="inline-error">{serverError}</div>}
        <form onSubmit={submit} noValidate>
          <label className="field">
            <span>Title <b>*</b></span>
            <input aria-label="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Finish API integration" />
            {errors.title && <small className="field-error">{errors.title}</small>}
          </label>
          <label className="field">
            <span>Description</span>
            <textarea aria-label="Task description" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add a short description..." />
          </label>
          <label className="field">
            <span>Status</span>
            <select aria-label="Task status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={saving}>{saving ? <LoadingSpinner label="Saving..." /> : task ? "Save changes" : "Create task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
