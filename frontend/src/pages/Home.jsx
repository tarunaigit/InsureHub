import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  Car,
  CheckCircle2,
  HeartPulse,
  House,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { planApi } from "../services/api";
import PlanCard from "../components/PlanCard";
import Loader from "../components/Loader";

const categories = [
  ["HEALTH", "Health", HeartPulse],
  ["VEHICLE", "Vehicle", Car],
  ["LIFE", "Life", UsersRound],
  ["HOME", "Home", House],
  ["TRAVEL", "Travel", BriefcaseBusiness],
  ["FAMILY", "Family", UsersRound],
];

export default function Home() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    planApi
      .list()
      .then((r) => setPlans((r.data || []).slice(0, 3)))
      .catch(() => setPlans([]));
  }, []);

  return (
    <div className="home-page">
      <section className="hero hero-reference">
        <div className="hero-inner">
          <div className="hero-copy hero-copy-reference">
            <span className="hero-pill">
              <ShieldCheck size={15} /> Trusted digital policy workspace
            </span>
            <h1>
              Your life,
              <br />
              <span>our priority.</span>
            </h1>
            <p>
              Explore insurance plans, estimate your premium and manage the full
              policy journey from one secure InsureHub account.
            </p>
            <div className="hero-actions">
              <Link className="primary-btn" to="/plans">
                Get protected <ArrowRight size={16} />
              </Link>
              <Link className="outline-btn hero-light-btn" to="/calculator">
                Calculate premium
              </Link>
            </div>
          </div>

          <div className="hero-art">
            <img
              src="/hero-art-0.png"
              alt="InsureHub family protection illustration"
            />
            <div className="float-card">
              <span>One secure workspace</span>
              <strong>Quote · purchase · renew · claim</strong>
            </div>
          </div>

          <div className="hero-proof">
            <span>
              <CheckCircle2 size={15} /> Secure account access
            </span>
            <span>
              <CheckCircle2 size={15} /> Clear premium breakdown
            </span>
            <span>
              <CheckCircle2 size={15} /> Full policy history
            </span>
          </div>
        </div>
      </section>

      <section className="section categories-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Insurance categories</span>
            <h2>Protection for every part of life</h2>
          </div>
          <Link to="/plans" className="text-link">
            Explore all plans <ArrowRight size={15} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map(([type, label, Icon]) => (
            <Link
              key={type}
              to={`/plans?type=${type}`}
              className={`category-tile type-${type}`}
            >
              <div className="category-icon">
                <Icon size={23} />
              </div>
              <div>
                <b>{label}</b>
                <span>Insurance</span>
              </div>
              <ArrowRight className="category-arrow" size={15} />
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured plans</span>
            <h2>Explore plans before you decide</h2>
          </div>
          <Link to="/plans" className="text-link">
            View catalogue <ArrowRight size={15} />
          </Link>
        </div>

        {plans.length ? (
          <div className="plans-preview">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <Loader />
        )}
      </section>

      <section className="landing-banner-section">
        <div className="landing-banner-overlay" />
        <div className="landing-banner-content">
          <div>
            <span className="eyebrow eyebrow-light">
              Secure today • Brighter tomorrow
            </span>
            <h2>One place for the complete policy lifecycle.</h2>
            <p>
              From the first quote to purchase, renewal, cancellation and
              history.
            </p>
          </div>
          <Link className="primary-btn" to="/register">
            Create account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section feature-strip-section">
        <div className="feature-strip">
          {[
            ["Secure & reliable", "JWT + role-based access", ShieldCheck],
            ["Clear pricing", "Instant premium breakdown", WalletCards],
            ["Simple servicing", "Buy, renew and cancel", CheckCircle2],
            ["Always available", "One dashboard for your policies", ShieldCheck],
          ].map(([title, sub, Icon]) => (
            <div className="feature" key={title}>
              <div className="feature-icon">
                <Icon size={20} />
              </div>
              <div>
                <b>{title}</b>
                <span>{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
