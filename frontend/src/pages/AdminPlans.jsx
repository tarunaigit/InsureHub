import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi, planApi } from "../services/api";
import PageHeader from "../components/PageHeader";
import ErrorBox from "../components/ErrorBox";

const empty = {
  name: "",
  type: "HEALTH",
  description: "",
  coverageAmount: 500000,
  minCoverageAmount: 100000,
  maxCoverageAmount: 1000000,
  basePremium: 10000,
  durationYears: 1,
  discountPercent: 0,
};

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setError("");

      const r = await adminApi.plans();

      // Only active plans are shown in the All Plans catalogue.
      setPlans(r.data.filter((p) => p.status === "ACTIVE"));
    } catch (e) {
      const message = e.response?.data?.message || "Could not load plans.";

      setError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setSelectedPlan(null);
    }
  };

  const confirmDelete = async () => {
  if (!selectedPlan) {
    return;
  }

  try {
    setDeleting(true);
    setError("");

    await planApi.remove(selectedPlan.id);

    toast.success("Plan deleted successfully.");

    setPlans((current) =>
      current.filter(
        (p) => p.id !== selectedPlan.id
      )
    );

    // Clear the edit form if the deleted plan
    // was currently being edited.
    if (editId === selectedPlan.id) {
      setForm({
        ...empty,
      });

      setEditId(null);
    }

    setSelectedPlan(null);
  } catch (e) {
    const message =
      e.response?.data?.message ||
      "Could not delete plan.";

    setError(message);
    toast.error(message);
  } finally {
    setDeleting(false);
  }
};

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const discount = Number(form.discountPercent ?? 0);

    if (!Number.isFinite(discount) || discount < 0 || discount > 10) {
      const message = "Discount must be between 0% and 10%.";

      setError(message);
      toast.error(message);

      return;
    }

    const payload = {
      ...form,
      discountPercent: discount,
    };

    try {
      if (editId) {
        await planApi.update(editId, payload);

        toast.success("Plan updated successfully.");
      } else {
        await planApi.create(payload);

        toast.success("Plan created successfully.");
      }

      setForm({
        ...empty,
      });

      setEditId(null);

      await load();
    } catch (e) {
      const message = e.response?.data?.message || "Could not save plan.";

      setError(message);
      toast.error(message);
    }
  };

  const edit = (p) => {
    setEditId(p.id);

    setForm({
      name: p.name,
      type: p.type,
      description: p.description,
      coverageAmount: p.coverageAmount,
      minCoverageAmount: p.minCoverageAmount,
      maxCoverageAmount: p.maxCoverageAmount,
      basePremium: p.basePremium,
      durationYears: p.durationYears,
      discountPercent: p.discountPercent ?? 0,
    });

    setError("");
  };

  const startNewPlan = () => {
    setForm({
      ...empty,
    });

    setEditId(null);
    setError("");
  };

  return (
    <main className="container">
      <PageHeader
        eyebrow="Admin"
        title="Manage insurance plans"
        subtitle="Create, update and remove insurance plans. The discount is configured per plan and applied automatically during premium calculation."
        actions={
          <button type="button" className="outline-btn" onClick={startNewPlan}>
            <Plus size={16} />
            New plan
          </button>
        }
      />

      <div className="admin-grid">
        {/* =========================
            CREATE / EDIT PLAN FORM
            ========================= */}

        <form className="details-card form-card" onSubmit={submit}>
          <div className="form-section">
            <h3>
              {editId ? (
                <>
                  <Edit3 size={19} />
                  Edit plan
                </>
              ) : (
                <>
                  <Plus size={19} />
                  Create plan
                </>
              )}
            </h3>

            <label>
              Name
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Type
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
              >
                <option>HEALTH</option>
                <option>VEHICLE</option>
                <option>LIFE</option>
                <option>HOME</option>
                <option>TRAVEL</option>
                <option>FAMILY</option>
              </select>
            </label>

            <label>
              Description
              <textarea
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Coverage
              <input
                type="number"
                min="1"
                value={form.coverageAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coverageAmount: Number(e.target.value),
                  })
                }
              />
            </label>

            <label>
              Min coverage
              <input
                type="number"
                min="1"
                value={form.minCoverageAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minCoverageAmount: Number(e.target.value),
                  })
                }
              />
            </label>

            <label>
              Max coverage
              <input
                type="number"
                min="1"
                value={form.maxCoverageAmount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxCoverageAmount: Number(e.target.value),
                  })
                }
              />
            </label>

            <label>
              Base premium
              <input
                type="number"
                min="1"
                value={form.basePremium}
                onChange={(e) =>
                  setForm({
                    ...form,
                    basePremium: Number(e.target.value),
                  })
                }
              />
            </label>

            <label>
              Duration years
              <input
                type="number"
                min="1"
                value={form.durationYears}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationYears: Number(e.target.value),
                  })
                }
              />
            </label>

            <label>
              Discount (%)
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={form.discountPercent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountPercent: Number(e.target.value),
                  })
                }
              />
              <small className="field-note">
                Plan discount applied automatically to the premium. Maximum 10%.
              </small>
            </label>

            <ErrorBox error={error} />

            <button className="primary-btn full" type="submit">
              {editId ? "Save changes" : "Create plan"}
            </button>
          </div>
        </form>

        {/* =========================
            PLAN CATALOGUE
            ========================= */}

        <section className="details-card">
          <div className="section-heading tight">
            <div>
              <span className="eyebrow">Plan catalogue</span>

              <h2>All plans</h2>
            </div>
          </div>

          <div className="admin-list">
            {plans.map((p) => (
              <div className="admin-row" key={p.id}>
                <div>
                  <b>{p.name}</b>

                  <span>
                    {p.type}
                    {" • "}
                    {p.status}
                    {" • "}
                    Discount {p.discountPercent ?? 0}%
                  </span>
                </div>

                <div className="row-actions plan-row-actions">
                  {/* EDIT */}
                  <button
                    type="button"
                    className="outline-btn small"
                    onClick={() => edit(p)}
                  >
                    <Edit3 size={15} />
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    type="button"
                    className="delete-icon-btn"
                    onClick={() => openDeleteModal(p)}
                    title="Delete plan"
                    aria-label="Delete plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {!plans.length && (
              <div className="empty-card">
                <h3>No plans available</h3>
                <p>Create a new insurance plan to add it to the catalogue.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =========================
          DELETE CONFIRMATION MODAL
          ========================= */}

      {selectedPlan && (
        <div className="delete-modal-backdrop" onMouseDown={closeDeleteModal}>
          <div
            className="delete-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              type="button"
              className="delete-modal-close"
              onClick={closeDeleteModal}
              disabled={deleting}
              aria-label="Close"
            >
              <X size={19} />
            </button>

            {/* ICON */}
            <div className="delete-modal-icon">
              <Trash2 size={22} />
            </div>

            {/* TITLE */}
            <h3>Delete plan?</h3>

            {/* DESCRIPTION */}
            <p>
              Are you sure you want to delete{" "}
              <strong>"{selectedPlan.name}"</strong>
              ?
            </p>

            {/* ACTIONS */}
            <div className="delete-modal-actions">
              <button
                type="button"
                className="outline-btn"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="danger-btn"
                onClick={confirmDelete}
                disabled={deleting}
              >
                <Trash2 size={16} />

                {deleting ? "Deleting..." : "Delete plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
