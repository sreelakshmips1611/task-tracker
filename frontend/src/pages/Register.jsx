import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi, getApiError } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (error) {
      setServerError(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell reverse-mobile">
      <div className="auth-visual register-visual">
        <div className="brand-mark">✓</div>
        <p className="eyebrow light">Start organised</p>
        <h1>Your next <span>productive day</span> starts here.</h1>
        <p className="visual-copy">Create a workspace, add your tasks, and keep progress visible without unnecessary complexity.</p>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">Create account</p>
          <h2>Join Task Tracker</h2>
          <p className="auth-muted">Set up your account in less than a minute.</p>
          {serverError && <div className="inline-error" role="alert">{serverError}</div>}
          <form onSubmit={submit} noValidate>
            <label className="field"><span>Full name</span><input aria-label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />{errors.name && <small className="field-error">{errors.name}</small>}</label>
            <label className="field"><span>Email</span><input aria-label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />{errors.email && <small className="field-error">{errors.email}</small>}</label>
            <div className="form-grid"><label className="field"><span>Password</span><input aria-label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" />{errors.password && <small className="field-error">{errors.password}</small>}</label><label className="field"><span>Confirm</span><input aria-label="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat password" />{errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}</label></div>
            <button className="button button-primary full" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
