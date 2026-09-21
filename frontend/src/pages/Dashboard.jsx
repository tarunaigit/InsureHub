import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  CalendarClock,
  Shield,
  WalletCards,
  Clock3,
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

import { policyApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import PolicyCard from "../components/PolicyCard";
import PageHeader from "../components/PageHeader";

const CHART_COLORS = ["#1789e6", "#42bfa1", "#f2af4a", "#cf4760", "#7b8798"];

export default function Dashboard() {
  const { user } = useAuth();

  const [policies, setPolicies] = useState(null);

  useEffect(() => {
    policyApi
      .mine()
      .then((r) => setPolicies(r.data))
      .catch(() => setPolicies([]));
  }, []);

  const stats = useMemo(() => {
    const a = policies || [];

    return {
      active: a.filter((p) => p.status === "ACTIVE" || p.status === "RENEWED")
        .length,

      coverage: a
        .filter((p) => p.status !== "CANCELLED")
        .reduce((s, p) => s + Number(p.coverageAmount), 0),

      due: a.filter(
        (p) =>
          new Date(p.expiryDate) - new Date() < 1000 * 60 * 60 * 24 * 30 &&
          p.status !== "CANCELLED",
      ).length,

      pending: a.filter((p) => p.status === "CANCEL_REQUESTED").length,
    };
  }, [policies]);

  const statusData = useMemo(() => {
    const map = {};

    (policies || []).forEach((p) => {
      map[p.status] = (map[p.status] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [policies]);

  const coverageData = useMemo(() => {
    return (policies || [])
      .filter((p) => p.status !== "CANCELLED")
      .slice(0, 8)
      .map((p) => ({
        policy: p.policyNumber,
        coverage: Number(p.coverageAmount),
      }));
  }, [policies]);

  if (!policies) {
    return <Loader />;
  }

  return (
    <main className="container">
      <PageHeader
        eyebrow={`Hello, ${user.name?.split(" ")[0] || "Customer"}`}
        title="Your insurance dashboard"
        subtitle="Keep protection, premiums and policy actions in one place."
        actions={
          <Link className="primary-btn" to="/plans">
            Browse plans
            <ArrowRight size={16} />
          </Link>
        }
      />

      <div className="stats-grid">
        <Stat icon={Shield} label="Active policies" value={stats.active} />

        <Stat
          icon={WalletCards}
          label="Total coverage"
          value={`₹${stats.coverage.toLocaleString("en-IN")}`}
        />

        <Stat icon={CalendarClock} label="Renewals due" value={stats.due} />

        <Stat icon={Clock3} label="Pending requests" value={stats.pending} />
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
            <div className="chart-wrap">
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
            </div>
          ) : (
            <div className="empty-inline">No policy data yet.</div>
          )}
        </section>

        <section className="dashboard-card chart-card">
          <div className="card-header">
            <div>
              <span className="eyebrow">Coverage</span>

              <h2>Coverage by policy</h2>
            </div>
          </div>

          {coverageData.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={coverageData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="policy" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="coverage" name="Coverage" fill="#42bfa1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-inline">No coverage data yet.</div>
          )}
        </section>
      </div>

      <div className="content-grid">
        <section>
          <div className="section-heading tight">
            <div>
              <span className="eyebrow">My policies</span>

              <h2>Latest policies</h2>
            </div>

            <Link to="/policies" className="text-link">
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {policies.length ? (
            <div className="stack">
              {policies.slice(0, 3).map((p) => (
                <PolicyCard key={p.id} policy={p} />
              ))}
            </div>
          ) : (
            <div className="empty-card">
              <h3>No policies yet</h3>

              <p>Your future is one step away from being more secure.</p>

              <Link className="primary-btn" to="/plans">
                Browse plans
              </Link>
            </div>
          )}
        </section>

        <aside className="side-card">
          <span className="eyebrow">Quick actions</span>

          <Link to="/calculator" className="quick-action">
            <CalculatorIcon />

            <span>
              <b>Premium Calculator</b>
              <small>Estimate your premium</small>
            </span>

            <ArrowRight size={16} />
          </Link>

          <Link to="/claims/new" className="quick-action">
            <Shield />

            <span>
              <b>File a claim</b>
              <small>Submit a new claim</small>
            </span>

            <ArrowRight size={16} />
          </Link>

          <Link to="/plans" className="quick-action">
            <Shield />

            <span>
              <b>Explore plans</b>
              <small>Compare available covers</small>
            </span>

            <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </main>
  );
}

const CalculatorIcon = () => (
  <div className="quick-icon">
    <WalletCards size={19} />
  </div>
);

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
