import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Ban, Clock3 } from "lucide-react";
import toast from "react-hot-toast";
import { policyApi } from "../services/api";
import PageHeader from "../components/PageHeader";
import ErrorBox from "../components/ErrorBox";
import Loader from "../components/Loader";
export default function CancelPolicy() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    policyApi
      .get(id)
      .then((r) => setP(r.data))
      .catch(() => nav("/policies"));
  }, [id]);
  const cancel = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await policyApi.cancel(id);
      toast.success("Cancellation request submitted.");
      nav(`/policies/${r.data.id}`);
    } catch (e) {
      setError(e.response?.data?.message || "Cancellation request failed.");
      toast.error(e.response?.data?.message || "Cancellation request failed.");
    } finally {
      setBusy(false);
    }
  };
  if (!p) return <Loader />;
  return (
    <main className="container narrow">
      <Link to={`/policies/${id}`} className="back-link">
        <ArrowLeft size={16} /> Back to policy
      </Link>
      <PageHeader
        eyebrow="Cancellation"
        title="Request policy cancellation"
        subtitle="Cancellation is recorded as a workflow request and requires admin review."
      />
      <div className="details-card">
        <div className="warning-banner">
          <Clock3 />
          <div>
            <b>Admin approval required</b>
            <p>
              Your policy remains in your records. No physical deletion occurs.
            </p>
          </div>
        </div>
        <div className="detail-list">
          <div className="detail-row">
            <span>Policy</span>
            <b>{p.policyNumber}</b>
          </div>
          <div className="detail-row">
            <span>Plan</span>
            <b>{p.planName}</b>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <b>{p.status}</b>
          </div>
        </div>
        <ErrorBox error={error} />
        <button className="danger-btn full" onClick={cancel} disabled={busy}>
          {busy ? "Submitting..." : "Submit cancellation request"}{" "}
          <Ban size={16} />
        </button>
      </div>
    </main>
  );
}
