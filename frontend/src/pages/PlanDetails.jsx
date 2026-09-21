import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import {
  planApi
} from "../services/api";

import Loader
  from "../components/Loader";

import PageHeader
  from "../components/PageHeader";

export default function PlanDetails() {

  const {
    id
  } = useParams();

  const [plan, setPlan] =
    useState(null);

  const navigate =
    useNavigate();

  useEffect(() => {

    planApi
      .get(id)
      .then(response =>
        setPlan(
          response.data
        )
      )
      .catch(() =>
        navigate(
          "/plans",
          {
            replace: true
          }
        )
      );

  }, [
    id,
    navigate
  ]);

  if (!plan) {
    return <Loader />;
  }

  return (
    <main className="container narrow">

      <Link
        to="/plans"
        className="back-link"
      >
        <ArrowLeft size={16} />
        Back to plans
      </Link>

      <PageHeader
        eyebrow={plan.type}
        title={plan.name}
        subtitle={plan.description}
      />

      <div className="details-card">

        <div className="details-hero">

          <div>

            <span className="eyebrow">
              Plan coverage
            </span>

            <strong>
              ₹
              {Number(
                plan.coverageAmount
              ).toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <ShieldCheck
            size={42}
          />

        </div>

        <div className="detail-list">

          <Row
            label="Base premium"
            value={
              `₹${Number(
                plan.basePremium
              ).toLocaleString(
                "en-IN"
              )}`
            }
          />

          <Row
            label="Coverage range"
            value={
              `₹${Number(
                plan.minCoverageAmount
              ).toLocaleString(
                "en-IN"
              )} – ₹${Number(
                plan.maxCoverageAmount
              ).toLocaleString(
                "en-IN"
              )}`
            }
          />

          <Row
            label="Maximum duration"
            value={
              `${plan.durationYears} year${
                plan.durationYears > 1
                  ? "s"
                  : ""
              }`
            }
          />

          <Row
            label="Plan discount"
            value={
              `${plan.discountPercent ?? 0}%`
            }
          />

          <Row
            label="Status"
            value={
              plan.status
            }
          />

        </div>

        <div className="details-actions">

          <Link
            to={`/calculator?planId=${plan.id}`}
            className="primary-btn"
          >
            Calculate premium
            <ArrowRight
              size={16}
            />
          </Link>

        </div>

      </div>

    </main>
  );
}

const Row = ({
  label,
  value
}) => (

  <div className="detail-row">

    <span>
      {label}
    </span>

    <b>
      {value}
    </b>

  </div>
);