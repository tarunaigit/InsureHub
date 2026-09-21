import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import { adminApi } from "../services/api";

export default function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [remarks, setRemarks] = useState({});

  const loadClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.claims();
      setClaims(response.data || []);
    } catch (e) {
      const message =
        e.response?.data?.message || "Unable to load claims.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const updateClaim = async (id, status) => {
    try {
      setUpdating(id);

      await adminApi.updateClaim(id, {
        status,
        adminRemarks: remarks[id] || "",
      });

      toast.success(`Claim marked as ${status}.`);

      await loadClaims();
    } catch (e) {
      const message =
        e.response?.data?.message || "Unable to update claim.";

      toast.error(message);
    } finally {
      setUpdating(null);
    }
  };

  const statusIcon = (status) => {
    if (status === "APPROVED") {
      return <CheckCircle2 size={16} />;
    }

    if (status === "REJECTED") {
      return <XCircle size={16} />;
    }

    return <Clock3 size={16} />;
  };

  const statusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "status-badge active";

      case "REJECTED":
        return "status-badge cancelled";

      case "UNDER_REVIEW":
        return "status-badge pending";

      default:
        return "status-badge pending";
    }
  };

  return (
    <main className="container">
      <div className="page-header">
        <div>
          <span className="eyebrow">CLAIMS</span>

          <h1>Manage claims</h1>

          <p>
            Review and manage insurance claims submitted by customers.
          </p>
        </div>

        <button
          className="outline-btn"
          onClick={loadClaims}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      {loading ? (
        <div className="details-card">
          <div className="screen-center">
            Loading claims...
          </div>
        </div>
      ) : claims.length === 0 ? (
        <div className="details-card empty-state">
          <ClipboardCheck size={42} />

          <h2>No claims yet</h2>

          <p>
            Customer-submitted claims will appear here.
          </p>
        </div>
      ) : (
        <div className="admin-list">
          {claims.map((claim) => (
            <div className="details-card" key={claim.id}>
              <div className="admin-list-header">
                <div>
                  <span className="eyebrow">
                    {claim.claimNumber}
                  </span>

                  <h2>{claim.claimType}</h2>
                </div>

                <span className={statusClass(claim.status)}>
                  {statusIcon(claim.status)}
                  {claim.status}
                </span>
              </div>

              <div className="admin-grid">
                <div>
                  <span>Customer</span>
                  <strong>{claim.userName}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{claim.userEmail}</strong>
                </div>

                <div>
                  <span>Policy</span>
                  <strong>{claim.policyNumber}</strong>
                </div>

                <div>
                  <span>Claim amount</span>
                  <strong>
                    ₹{" "}
                    {Number(claim.claimAmount || 0).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </strong>
                </div>

                <div>
                  <span>Incident date</span>
                  <strong>{claim.incidentDate}</strong>
                </div>

                <div>
                  <span>Submitted</span>
                  <strong>
                    {claim.createdAt
                      ? new Date(claim.createdAt).toLocaleString(
                          "en-IN"
                        )
                      : "-"}
                  </strong>
                </div>
              </div>

              <div className="claim-description">
                <span>Description</span>
                <p>{claim.description}</p>
              </div>

              {claim.adminRemarks && (
                <div className="claim-description">
                  <span>Admin remarks</span>
                  <p>{claim.adminRemarks}</p>
                </div>
              )}

              <div className="claim-actions">
                <textarea
                  placeholder="Add admin remarks..."
                  value={remarks[claim.id] || ""}
                  onChange={(e) =>
                    setRemarks({
                      ...remarks,
                      [claim.id]: e.target.value,
                    })
                  }
                  rows={3}
                />

                <div className="claim-buttons">
                  <button
                    className="outline-btn"
                    disabled={updating === claim.id}
                    onClick={() =>
                      updateClaim(claim.id, "UNDER_REVIEW")
                    }
                  >
                    <Clock3 size={16} />
                    Review
                  </button>

                  <button
                    className="primary-btn"
                    disabled={updating === claim.id}
                    onClick={() =>
                      updateClaim(claim.id, "APPROVED")
                    }
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>

                  <button
                    className="danger-btn"
                    disabled={updating === claim.id}
                    onClick={() =>
                      updateClaim(claim.id, "REJECTED")
                    }
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}