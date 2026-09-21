import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { planApi } from "../services/api";
import PlanCard from "../components/PlanCard";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";
export default function Plans() {
  const [plans, setPlans] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [error, setError] = useState("");
  useEffect(() => {
    planApi
      .list()
      .then((r) => setPlans(r.data))
      .catch((e) => {
        setPlans([]);
        setError(e.response?.data?.message || "Unable to load plans.");
      });
  }, []);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (plans || []).filter(
      (p) =>
        (type === "ALL" || p.type === type) &&
        (!q ||
          `${p.name} ${p.type} ${p.description}`.toLowerCase().includes(q)),
    );
  }, [plans, search, type]);
  if (!plans) return <Loader />;
  return (
    <main className="container">
      <PageHeader
        eyebrow="Insurance plans"
        title="Choose protection that fits"
        subtitle="Plan categories are inspired by the kinds of digital journeys offered by major Indian insurers and aggregators."
      />
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search plans"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <SlidersHorizontal size={18} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>ALL</option>
            <option>HEALTH</option>
            <option>VEHICLE</option>
            <option>LIFE</option>
            <option>HOME</option>
            <option>TRAVEL</option>
            <option>FAMILY</option>
          </select>
        </div>
      </div>
      <ErrorBox error={error} />
      <div className="plans-grid">
        {filtered.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-card">
          <img src="/empty-state.png" alt="No plans found" />
          <h3>No plans found</h3>
          <p>Try another search or category.</p>
        </div>
      )}
    </main>
  );
}
