import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Plus, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { claimApi } from "../services/api";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";

export default function Claims() {
  const [claims, setClaims] = useState(null);

  const load = async () => {
    try {
      const response = await claimApi.mine();
      setClaims(response.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to load claims.");
      setClaims([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!claims) {
    return <Loader />;
  }

  return (
    <main className="container">
      <PageHeader
        eyebrow="Claims"
        title="Your claims"
        subtitle="File and track insurance claims linked to your policies."
        actions={
          <Link className="primary-btn" to="/claims/new">
            <Plus size={16} />
            File a claim
          </Link>
        }
      />

      {!claims.length ? (
        <div className="empty-card">
          <img src="/empty-state.png" alt="No claims found" />
          <h3>No claims yet</h3>
          <p>You haven't submitted any insurance claims.</p>

          <Link className="primary-btn" to="/claims/new">
            File your first claim
          </Link>
        </div>
      ) : (
        <div className="stack">
          {claims.map((claim) => (
            <div className="policy-card" key={claim.id}>
              <div className="policy-main">
                <div>
                  <span className="policy-number">{claim.claimNumber}</span>

                  <h3>{claim.claimType}</h3>
                </div>

                <StatusBadge status={claim.status} />
              </div>

              <div className="policy-grid">
                <span>
                  <small>Policy</small>
                  <b>{claim.policyNumber}</b>
                </span>

                <span>
                  <small>Claim amount</small>
                  <b>₹{Number(claim.claimAmount).toLocaleString("en-IN")}</b>
                </span>

                <span>
                  <small>Incident date</small>
                  <b>{claim.incidentDate}</b>
                </span>
              </div>

              <p className="claim-description">{claim.description}</p>

              {claim.adminRemarks && (
                <div className="claim-remarks">
                  <b>Admin remarks</b>
                  <p>{claim.adminRemarks}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
