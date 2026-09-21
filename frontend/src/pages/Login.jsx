import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";
import ErrorBox from "../components/ErrorBox";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const goAfterAuth = (data) => {
    toast.success(
      `Welcome${data.user?.name ? `, ${data.user.name.split(" ")[0]}` : ""}!`,
    );
    nav(
      data.user?.role === "ADMIN" ? "/admin" : loc.state?.from || "/dashboard",
      { replace: true },
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      goAfterAuth(await login(form));
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to sign in.";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const googleSuccess = async (data) => goAfterAuth(await Promise.resolve(data));

  return (
    <AuthShell
      title="Welcome back"
      sub="Sign in to manage your insurance policies from one secure workspace."
      illustrationSrc="/login-illustration.png"
    >
      <form onSubmit={submit} className="auth-card">
        <div className="auth-kicker">
          <ShieldCheck size={16} /> Secure account access
        </div>

        <div className="form-fields">
          <Field icon={Mail} label="Email address">
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>

          <Field icon={Lock} label="Password">
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Field>
        </div>

        <ErrorBox error={error} />

        <button className="primary-btn full auth-submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
          <ArrowRight size={16} />
        </button>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <GoogleSignIn onSuccess={googleSuccess} />

        <p className="form-foot">
          New to InsureHub? <Link to="/register">Create a customer account</Link>
        </p>

        <p className="auth-note">
          <ShieldCheck size={14} /> Administrators use the same sign-in page. Your
          account role controls what you can access.
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

function AuthShell({ title, sub, children, illustrationSrc = "/login-illustration.png" }) {
  return (
    <section className="auth-page auth-login-page">
      <div className="auth-backdrop">
        <div className="auth-overlay" />
        <div className="auth-backdrop-content">
          <img src="/vertical-logo.png" alt="InsureHub" className="auth-logo" />
          <span className="eyebrow auth-eyebrow">Secure today • Brighter tomorrow</span>
          <h1>Protection that stays with you.</h1>
          <p>
            Explore plans, calculate premiums and keep the complete policy lifecycle
            in one place.
          </p>
          <div className="auth-benefits">
            <span><ShieldCheck size={16} /> Role-based access</span>
            <span><ShieldCheck size={16} /> Policy history</span>
            <span><ShieldCheck size={16} /> Secure payments</span>
          </div>
          <img
            src={illustrationSrc}
            alt="InsureHub account illustration"
            className="auth-illustration"
          />
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          <span className="eyebrow">InsureHub account</span>
          <h2>{title}</h2>
          <p className="auth-subtitle">{sub}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

export { AuthShell };
