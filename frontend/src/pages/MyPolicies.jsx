import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { policyApi } from "../services/api";
import PolicyCard from "../components/PolicyCard";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
export default function MyPolicies() {
  const [policies, setPolicies] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    policyApi
      .mine()
      .then((r) => setPolicies(r.data))
      .catch(() => setPolicies([]));
  }, []);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (policies || []).filter((p) =>
      `${p.policyNumber} ${p.planName} ${p.status}`.toLowerCase().includes(q),
    );
  }, [policies, search]);
  if (!policies) return <Loader />;
  return (
    <main className="container">
      <PageHeader
        eyebrow="My policies"
        title="Your policy portfolio"
        subtitle="View status, expiry, payment and history for every policy."
      />
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search policy number, plan or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="stack">
        {filtered.map((p) => (
          <PolicyCard key={p.id} policy={p} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-card">
          <h3>No matching policies</h3>
          <p>Try another search.</p>
        </div>
      )}
    </main>
  );
}
