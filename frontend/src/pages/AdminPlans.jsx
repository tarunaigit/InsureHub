import { useEffect, useState } from "react";
import { Edit3, Plus, Power } from "lucide-react";
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

  const load = async () => {
    try {
      setError("");

      const r = await adminApi.plans();

      setPlans(r.data);
    } catch (e) {
      const message = e.response?.data?.message || "Could not load plans.";

      setError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const remove = async (id) => {
    if (confirm("Deactivate this plan?")) {
      try {
        await planApi.remove(id);

        toast.success("Plan deactivated.");

        await load();
      } catch (e) {
        const message = e.response?.data?.message || "Could not deactivate.";

        setError(message);

        toast.error(message);
      }
    }
  };

  return (
    <main className="container">
      <PageHeader
        eyebrow="Admin"
        title="Manage insurance plans"
        subtitle="Create, update and deactivate insurance plans. The discount is configured per plan and applied automatically during premium calculation."
        actions={
          <button
            className="outline-btn"
            onClick={() => {
              setForm({
                ...empty,
              });

              setEditId(null);
              setError("");
            }}
          >
            <Plus size={16} />
            New plan
          </button>
        }
      />

      <div className="admin-grid">
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
                    {p.type} • {p.status}
                    {" • "}
                    Discount {p.discountPercent ?? 0}%
                  </span>
                </div>

                <div className="row-actions">
                  <button className="outline-btn small" onClick={() => edit(p)}>
                    <Edit3 size={15} />
                    Edit
                  </button>

                  {p.status === "ACTIVE" && (
                    <button
                      className="danger-icon-btn"
                      onClick={() => remove(p.id)}
                      title="Deactivate"
                    >
                      <Power size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
