import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Send } from "lucide-react";
import toast from "react-hot-toast";

import { claimApi, policyApi } from "../services/api";

import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";

export default function NewClaim() {
  const navigate = useNavigate();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    policyId: "",
    claimType: "",
    claimAmount: "",
    incidentDate: "",
    description: "",
  });

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const response = await policyApi.mine();

        const activePolicies = (response.data || []).filter(
          (policy) => policy.status === "ACTIVE" || policy.status === "RENEWED",
        );

        setPolicies(activePolicies);

        if (activePolicies.length === 1) {
          setForm((current) => ({
            ...current,
            policyId: String(activePolicies[0].id),
          }));
        }
      } catch (e) {
        setError(e.response?.data?.message || "Unable to load your policies.");
      } finally {
        setLoading(false);
      }
    };

    loadPolicies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submitClaim = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.policyId) {
      setError("Please select a policy.");
      return;
    }

    if (!form.claimType.trim()) {
      setError("Please enter the claim type.");
      return;
    }

    if (!form.claimAmount || Number(form.claimAmount) <= 0) {
      setError("Please enter a valid claim amount.");
      return;
    }

    if (!form.incidentDate) {
      setError("Please select the incident date.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    setBusy(true);

    try {
      await claimApi.create({
        policyId: Number(form.policyId),
        claimType: form.claimType.trim(),
        claimAmount: Number(form.claimAmount),
        incidentDate: form.incidentDate,
        description: form.description.trim(),
      });

      toast.success("Claim submitted successfully.");

      navigate("/claims");
    } catch (e) {
      const message =
        e.response?.data?.message || "Unable to submit the claim.";

      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="container narrow">
      <Link to="/claims" className="back-link">
        <ArrowLeft size={16} />
        Back to claims
      </Link>

      <PageHeader
        eyebrow="Claims"
        title="File a claim"
        subtitle="Submit a claim linked to one of your active policies."
      />

      {!policies.length ? (
        <div className="empty-card">
          <img src="/empty-state.png" alt="No eligible policies" />

          <h3>No eligible policies</h3>

          <p>You need an active policy before you can submit a claim.</p>

          <Link to="/policies" className="primary-btn">
            View my policies
          </Link>
        </div>
      ) : (
        <form className="details-card" onSubmit={submitClaim}>
          <div className="form-grid">
            <label className="form-field">
              <span>Policy</span>

              <select
                name="policyId"
                value={form.policyId}
                onChange={handleChange}
                required
              >
                <option value="">Select a policy</option>

                {policies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.policyNumber} — {policy.planName}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Claim type</span>

              <select
                name="claimType"
                value={form.claimType}
                onChange={handleChange}
                required
              >
                <option value="">Select claim type</option>
                <option value="Medical">Medical</option>
                <option value="Hospitalization">Hospitalization</option>
                <option value="Accident">Accident</option>
                <option value="Property Damage">Property Damage</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="form-field">
              <span>Claim amount (₹)</span>

              <input
                type="number"
                name="claimAmount"
                value={form.claimAmount}
                onChange={handleChange}
                min="1"
                step="0.01"
                placeholder="Enter claim amount"
                required
              />
            </label>

            <label className="form-field">
              <span>Incident date</span>

              <input
                type="date"
                name="incidentDate"
                value={form.incidentDate}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field full">
              <span>Description</span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="6"
                placeholder="Describe what happened and provide relevant details..."
                required
              />
            </label>
          </div>

          <ErrorBox error={error} />

          <div className="info-box">
            <FileText size={20} />

            <div>
              <b>Claim submission</b>

              <p>
                Your claim will be submitted for review. You can track its
                status from the Claims section.
              </p>
            </div>
          </div>

          <button type="submit" className="primary-btn full" disabled={busy}>
            {busy ? "Submitting claim..." : "Submit claim"}
            <Send size={16} />
          </button>
        </form>
      )}
    </main>
  );
}
