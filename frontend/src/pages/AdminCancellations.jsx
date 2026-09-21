import { useEffect, useState } from "react";
import { Check, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi } from "../services/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import ErrorBox from "../components/ErrorBox";
import Loader from "../components/Loader";

export default function AdminCancellations() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const load = () => {
    setError("");
    return adminApi
      .cancellations()
      .then((r) => setItems(r.data))
      .catch((e) => {
        const msg =
          e.response?.data?.message || "Unable to load cancellation requests.";
        setItems([]);
        setError(msg);
        toast.error(msg);
      });
  };
  useEffect(() => {
    load();
  }, []);
  const act = async (id, kind) => {
    setBusyId(id);
    try {
      if (kind === "approve") await adminApi.approve(id);
      else await adminApi.reject(id);
      toast.success(
        kind === "approve"
          ? "Cancellation approved."
          : "Cancellation rejected.",
      );
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Action failed.");
    } finally {
      setBusyId(null);
    }
  };
  if (!items)
    return (
      <main className="container">
        <Loader />
      </main>
    );
  return (
    <main className="container">
      <PageHeader
        eyebrow="Admin workflow"
        title="Cancellation requests"
        subtitle="Approve or reject requests; every decision is written to policy history."
        actions={
          <button className="outline-btn" onClick={load}>
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />
      <ErrorBox error={error} />
      <div className="table-card">
        {items.map((x) => (
          <div className="table-row" key={x.policyId}>
            <span>
              <b>{x.policyNumber}</b>
              <small>{x.requestedOn}</small>
            </span>
            <span>
              {x.customerName}
              <small>{x.customerEmail}</small>
            </span>
            <span>{x.planName}</span>
            <span>
              <StatusBadge status="CANCEL_REQUESTED" />
            </span>
            <span className="row-actions">
              <button
                className="success-btn"
                disabled={busyId === x.policyId}
                onClick={() => act(x.policyId, "approve")}
                title="Approve"
              >
                <Check size={16} />
              </button>
              <button
                className="danger-icon-btn"
                disabled={busyId === x.policyId}
                onClick={() => act(x.policyId, "reject")}
                title="Reject"
              >
                <X size={16} />
              </button>
            </span>
          </div>
        ))}
        {!items.length && (
          <div className="empty-card compact">
            <h3>Nothing is waiting for review</h3>
            <p>The cancellation queue is clear.</p>
          </div>
        )}
      </div>
    </main>
  );
}
