import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Clock3,
  Download,
  FileText,
  Plus,
  RefreshCw,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";
import { adminApi } from "../services/api";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";

const CHART_COLORS = ["#1789e6", "#42bfa1", "#f2af4a", "#cf4760", "#7b8798"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [a, d, p] = await Promise.all([
        adminApi.stats(),
        adminApi.cancellations(),
        adminApi.policies(),
      ]);

      setStats(a.data);
      setRequests(d.data);
      setPolicies(p.data);
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        "Unable to load the administrator dashboard.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const exportCsv = async () => {
    try {
      const { data } = await adminApi.policies();
      const rows = [
        [
          "Policy",
          "Plan",
          "Customer",
          "Status",
          "Premium",
          "Coverage",
          "Expiry",
        ],
        ...data.map((p) => [
          p.policyNumber,
          p.planName,
          p.ownerEmail,
          p.status,
          p.premium,
          p.coverageAmount,
          p.expiryDate,
        ]),
      ];
      const csv = rows
        .map((r) =>
          r.map((x) => `"${String(x ?? "").replaceAll('"', '""')}"`).join(","),
        )
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "insurehub-policies.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Policy export downloaded.");
    } catch (e) {
      toast.error(e.response?.data?.message || "Export failed.");
    }
  };
  if (loading)
    return (
      <main className="container">
        <Loader />
      </main>
    );
  if (error && !stats)
    return (
      <main className="container">
        <div className="admin-error-card">
          <Activity size={24} />
          <h2>Administrator data could not be loaded</h2>
          <p>{error}</p>
          <button className="primary-btn" onClick={load}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </main>
    );

  const statusData = Object.entries(
    policies.reduce((acc, policy) => {
      acc[policy.status] = (acc[policy.status] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const planData = Object.entries(
    policies.reduce((acc, policy) => {
      acc[policy.planName] = (acc[policy.planName] || 0) + 1;
      return acc;
    }, {}),
  ).map(([plan, count]) => ({
    plan,
    count,
  }));
  return (
    <main className="container admin-shell">
      <div className="admin-hero">
        <div>
          <span className="eyebrow eyebrow-light">Administrator</span>
          <h1>Operations at a glance.</h1>
          <p>
            Manage plans, review policy activity and resolve cancellation
            workflows.
          </p>
        </div>
        <div className="admin-hero-actions">
          <button className="outline-btn hero-outline-btn" onClick={load}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="primary-btn" onClick={exportCsv}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>
      <div className="stats-grid admin-stats">
        <Stat icon={UsersRound} label="Customers" value={stats.customers} />
        <Stat icon={ShieldCheck} label="Plans" value={stats.plans} />
        <Stat icon={FileText} label="Policies" value={stats.policies} />
        <Stat
          icon={Clock3}
          label="Pending cancellations"
          value={stats.cancellationRequests}
        />
      </div>
      <div className="chart-grid">
        <section className="dashboard-card chart-card">
          <div className="card-header">
            <div>
              <span className="eyebrow">Portfolio</span>

              <h2>Policy status</h2>
            </div>
          </div>

          {statusData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-inline">No policy data.</div>
          )}
        </section>

        <section className="dashboard-card chart-card">
          <div className="card-header">
            <div>
              <span className="eyebrow">Plans</span>

              <h2>Policies by plan</h2>
            </div>
          </div>

          {planData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={planData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="plan" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="count" name="Policies" fill="#1789e6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-inline">No policy data.</div>
          )}
        </section>
      </div>
      <div className="admin-dashboard-grid">
        <section className="dashboard-card dashboard-wide">
          <div className="card-header">
            <div>
              <span className="eyebrow">Needs attention</span>
              <h2>Cancellation queue</h2>
            </div>
            <Link className="text-link" to="/admin/cancellations">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          {requests.slice(0, 5).map((r) => (
            <div className="queue-row" key={r.policyId}>
              <div>
                <b>{r.policyNumber}</b>
                <span>
                  {r.customerName} · {r.planName}
                </span>
              </div>
              <StatusBadge status="CANCEL_REQUESTED" />
              <Link className="outline-btn small" to="/admin/cancellations">
                Review
              </Link>
            </div>
          ))}
          {!requests.length && (
            <div className="empty-card compact">
              <h3>No pending requests</h3>
              <p>The cancellation queue is clear.</p>
            </div>
          )}
        </section>
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <span className="eyebrow">Management</span>
              <h2>Admin tools</h2>
            </div>
          </div>
          <Tool
            to="/admin/plans"
            icon={Plus}
            title="Manage plans"
            sub="Create, update, deactivate"
          />
          <Tool
            to="/admin/users"
            icon={UsersRound}
            title="Customers"
            sub="Review registered accounts"
          />
          <Tool
            to="/admin/policies"
            icon={FileText}
            title="Policies"
            sub="Inspect lifecycle and history"
          />
        </section>
      </div>
    </main>
  );
}
function Tool({ to, icon: Icon, title, sub }) {
  return (
    <Link className="admin-tool" to={to}>
      <div className="admin-tool-icon">
        <Icon size={18} />
      </div>
      <div>
        <b>{title}</b>
        <span>{sub}</span>
      </div>
      <ArrowRight size={16} />
    </Link>
  );
}
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
