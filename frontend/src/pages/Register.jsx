import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Phone, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "./Login";
import GoogleSignIn from "../components/GoogleSignIn";
import ErrorBox from "../components/ErrorBox";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();
  const finish = (data) => {
    toast.success("Account created successfully.");
    nav(data.user?.role === "ADMIN" ? "/admin" : "/dashboard", {
      replace: true,
    });
  };
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      finish(await register(form));
    } catch (err) {
      const msg =
        err.response?.data?.message || "Unable to create your account.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthShell
      title="Create your account"
      sub="Start with a secure customer account and manage every policy from one workspace."
      illustrationSrc="/register-illustration.png"
    >
      <form onSubmit={submit} className="auth-card">
        <div className="auth-kicker">
          <UserRound size={16} /> Customer registration
        </div>
        <div className="form-fields">
          <Field icon={UserRound} label="Full name">
            <input
              placeholder="Your full name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field icon={Mail} label="Email address">
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>
          <Field icon={Phone} label="Phone number">
            <input
              placeholder="Optional"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field icon={Lock} label="Password">
            <input
              type="password"
              minLength="8"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Field>
        </div>
        <ErrorBox error={error} />
        <button className="primary-btn full auth-submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
          <ArrowRight size={16} />
        </button>
        <div className="auth-divider">
          <span>or continue with</span>
        </div>
        <GoogleSignIn text="Sign up with Google" onSuccess={finish} />
        <p className="form-foot">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
        <p className="auth-note">
          Google sign-in creates a CUSTOMER account when the email is new;
          existing account roles are preserved.
        </p>
      </form>
    </AuthShell>
  );
}
function Field({ icon: Icon, label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-wrap">
        <Icon size={17} />
        {children}
      </div>
    </label>
  );
}
