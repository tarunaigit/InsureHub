import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import { adminApi } from "../services/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";

export default function AdminPolicies() {
  const [ps, setPs] = useState(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("expiry");
  const [error, setError] = useState("");
  const load = async () => {
    try {
      const r = await adminApi.policies();
      setPs(r.data);
    } catch (e) {
      setPs([]);
      setError(e.response?.data?.message || "Unable to load policies.");
    }
  };

  useEffect(() => {
    load();
  }, []);
  const filtered = useMemo(() => {
    const x = (ps || []).filter(
      (p) =>
        (status === "ALL" || p.status === status) &&
        (!q ||
          `${p.policyNumber} ${p.ownerEmail} ${p.planName}`
            .toLowerCase()
            .includes(q.toLowerCase())),
    );
    return [...x].sort((a, b) =>
      sort === "expiry"
        ? String(a.expiryDate).localeCompare(String(b.expiryDate))
        : String(a.policyNumber).localeCompare(String(b.policyNumber)),
    );
  }, [ps, q, status, sort]);
  if (!ps)
    return (
      <main className="container">
        <Loader />
      </main>
    );
  return (
    <main className="container">
      <PageHeader
        eyebrow="Admin"
        title="All policies"
        subtitle="Search, filter and inspect every customer policy without leaving the administrator workspace."
      />
      <ErrorBox error={error} />
      <div className="policy-toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            placeholder="Search policy, customer or plan"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="toolbar-control">
          <Filter size={17} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All statuses</option>
            <option>ACTIVE</option>
            <option>RENEWED</option>
            <option>EXPIRED</option>
            <option>CANCEL_REQUESTED</option>
            <option>CANCELLED</option>
          </select>
        </div>
        <button
          className="outline-btn"
          onClick={() => setSort(sort === "expiry" ? "policy" : "expiry")}
        >
          <ArrowUpDown size={16} /> Sort:{" "}
          {sort === "expiry" ? "Expiry" : "Policy"}
        </button>
      </div>
      <div className="table-card admin-table">
        {filtered.map((p) => (
          <div className="table-row" key={p.id}>
            <span>
              <b>{p.policyNumber}</b>
              <small>
                {p.startDate} → {p.expiryDate}
              </small>
            </span>
            <span>{p.ownerEmail}</span>
            <span>{p.planName}</span>
            <span>
              <StatusBadge status={p.status} />
            </span>
            <span>₹{Number(p.premium).toLocaleString("en-IN")}</span>
            <span>
              <Link className="outline-btn small" to={`/policies/${p.id}`}>
                View
              </Link>
            </span>
          </div>
        ))}
        {!filtered.length && (
          <div className="empty-card compact">
            <h3>No policies match</h3>
            <p>Try another search or status filter.</p>
          </div>
        )}
      </div>
    </main>
  );
}
