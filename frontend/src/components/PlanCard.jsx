import {
  ArrowRight,
  HeartPulse,
  Car,
  UsersRound,
  House,
  BriefcaseBusiness,
  ShieldCheck,
  Check
} from "lucide-react";

import { Link } from "react-router-dom";

const iconMap = {
  HEALTH: HeartPulse,
  VEHICLE: Car,
  LIFE: UsersRound,
  HOME: House,
  TRAVEL: BriefcaseBusiness,
  FAMILY: UsersRound
};

export default function PlanCard({
  plan
}) {

  const Icon =
    iconMap[plan.type] ||
    ShieldCheck;

  return (
    <article className="plan-card">

      <div
        className={`plan-icon type-${plan.type}`}
      >
        <Icon size={28} />
      </div>

      <div className="plan-top">

        <span className="eyebrow">
          {plan.type}
        </span>

        <h3>
          {plan.name}
        </h3>

      </div>

      <p>
        {plan.description}
      </p>

      <div className="plan-meta">

        <div>
          <small>
            Base premium
          </small>

          <strong>
            ₹
            {Number(
              plan.basePremium
            ).toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>

        <div>
          <small>
            Cover
          </small>

          <strong>
            ₹
            {Number(
              plan.coverageAmount
            ).toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>

        <div>
          <small>
            Term
          </small>

          <strong>
            {plan.durationYears} yr
          </strong>
        </div>

        <div>
          <small>
            Discount
          </small>

          <strong>
            {plan.discountPercent ?? 0}%
          </strong>
        </div>

      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "#5f7488",
          fontSize: 10
        }}
      >
        <Check
          size={13}
          style={{
            color: "var(--mint)"
          }}
        />

        Plan discount applied automatically
      </div>

      <Link
        className="outline-btn full"
        to={`/plans/${plan.id}`}
      >
        View plan
        <ArrowRight size={15} />
      </Link>

    </article>
  );
}