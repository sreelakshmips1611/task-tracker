import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getApiError } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { authenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (error) {
      setServerError(error.message || getApiError(error, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="brand-mark">✓</div>
        <p className="eyebrow light">Task Tracker</p>
        <h1>Turn busy work into <span>clear progress.</span></h1>
        <p className="visual-copy">A focused workspace for tracking tasks, staying organised, and seeing what needs attention next.</p>
        <div className="visual-pills"><span>Simple</span><span>Secure</span><span>Responsive</span></div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="auth-muted">Use your registered account to continue.</p>
          {serverError && <div className="inline-error" role="alert">{serverError}</div>}
          <form onSubmit={submit} noValidate>
            <label className="field"><span>Email</span><input aria-label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />{errors.email && <small className="field-error">{errors.email}</small>}</label>
            <label className="field"><span>Password</span><input aria-label="Password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />{errors.password && <small className="field-error">{errors.password}</small>}</label>
            <button className="button button-primary full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <p className="auth-switch">New to Task Tracker? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
