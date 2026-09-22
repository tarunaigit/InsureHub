import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  RefreshCw,
  Ban,
  History,
  WalletCards,
  FileText,
} from "lucide-react";
import { policyApi, paymentApi } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
export default function PolicyDetails() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { id } = useParams();
  const loc = useLocation();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [h, setH] = useState([]);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    Promise.all([
      policyApi.get(id),
      policyApi.history(id),
      paymentApi.forPolicy(id),
    ])
      .then(([a, b, c]) => {
        setP(a.data);
        setH(b.data);
        setPayments(c.data);
      })
      .catch(() => nav("/policies"));
  }, [id]);
  if (!p) return <Loader />;
  return (
    <main className="container narrow">
      <Link to="/policies" className="back-link">
        <ArrowLeft size={16} /> Back to policies
      </Link>
      {loc.state?.purchaseSuccess && (
        <div className="success-box">
          Policy purchased and payment recorded successfully.
        </div>
      )}
      <PageHeader
        eyebrow={p.policyNumber}
        title={p.planName}
        subtitle={p.planType}
      />
      <div className="details-card">
        <div className="details-status">
          <StatusBadge status={p.status} />
          <span>
            {p.ownerName} • {p.ownerEmail}
          </span>
        </div>
        <div className="detail-stats">
          <Stat
            label="Coverage"
            value={`₹${Number(p.coverageAmount).toLocaleString("en-IN")}`}
            icon={WalletCards}
          />
          <Stat
            label="Premium"
            value={`₹${Number(p.premium).toLocaleString("en-IN")}`}
            icon={IndianRupee}
          />
          <Stat label="Start" value={p.startDate} icon={CalendarDays} />
          <Stat label="Expiry" value={p.expiryDate} icon={CalendarDays} />
        </div>
        {!isAdmin && (
          <div className="details-actions">
            {["ACTIVE", "RENEWED", "EXPIRED"].includes(p.status) && (
              <Link className="primary-btn" to={`/policies/${p.id}/renew`}>
                Renew <RefreshCw size={16} />
              </Link>
            )}

            {["ACTIVE", "RENEWED", "EXPIRED"].includes(p.status) && (
              <Link className="danger-btn" to={`/policies/${p.id}/cancel`}>
                Request cancellation <Ban size={16} />
              </Link>
            )}

            {["ACTIVE", "RENEWED", "EXPIRED"].includes(p.status) && (
              <Link className="outline-btn" to="/claims/new">
                <FileText size={16} />
                File a claim
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="content-grid">
        <section className="details-card">
          <div className="section-heading tight">
            <div>
              <span className="eyebrow">Policy history</span>
              <h2>Audit trail</h2>
            </div>
            <History size={22} />
          </div>
          <div className="timeline">
            {h.map((x) => (
              <div className="timeline-item" key={x.id}>
                <div className="timeline-dot" />
                <div>
                  <b>{x.action.replaceAll("_", " ")}</b>
                  <p>{x.description}</p>
                  <small>
                    {x.performedBy} • {new Date(x.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="details-card">
          <div className="section-heading tight">
            <div>
              <span className="eyebrow">Payments</span>
              <h2>Premium transactions</h2>
            </div>
            <WalletCards size={21} />
          </div>
          {payments.length ? (
            payments.map((x) => (
              <div className="payment-row" key={x.id}>
                <div>
                  <b>{x.gateway}</b>
                  <span>{x.transactionId || x.orderId || "Pending"}</span>
                </div>
                <StatusBadge status={x.status} />
                <strong>₹{Number(x.amount).toLocaleString("en-IN")}</strong>
              </div>
            ))
          ) : (
            <p>No payment records.</p>
          )}
        </aside>
      </div>
    </main>
  );
}
const Stat = ({ label, value, icon: Icon }) => (
  <div className="mini-stat">
    <Icon size={16} />
    <span>{label}</span>
    <b>{value}</b>
  </div>
);
