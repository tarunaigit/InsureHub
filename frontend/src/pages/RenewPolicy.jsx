import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import { policyApi, paymentApi } from "../services/api";

import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import ErrorBox from "../components/ErrorBox";

export default function RenewPolicy() {
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
  }, [id, nav]);

  const renew = async () => {
    setBusy(true);
    setError("");

    try {
      const orderResponse = await paymentApi.renewalOrder(id);

      const order = orderResponse.data;

      /*
       * MOCK PAYMENT MODE
       */
      if (order.mode === "mock") {
        await paymentApi.verify({
          policyId: id,
          orderId: order.orderId,
          paymentId: order.orderId,
          signature: "",
        });

        /*
         * Only renew AFTER payment verification.
         */
        const r = await policyApi.renew(id);

        toast.success("Policy renewed successfully.");

        nav(`/policies/${r.data.id}`, {
          state: {
            renewed: true,
          },
        });

        return;
      }

      /*
       * RAZORPAY CHECKOUT
       */
      const options = {
        key: order.keyId,

        amount: Number(order.amount) * 100,

        currency: order.currency,

        name: "InsureHub",

        description: `Renewal payment for ${order.policyNumber}`,

        order_id: order.orderId,

        handler: async function (response) {
          try {
            /*
             * STEP 2:
             * Verify Razorpay payment on backend.
             */
            await paymentApi.verify({
              policyId: id,

              orderId: response.razorpay_order_id,

              paymentId: response.razorpay_payment_id,

              signature: response.razorpay_signature,
            });

            /*
             * STEP 3:
             * Only after successful verification,
             * renew the policy.
             */
            const r = await policyApi.renew(id);

            toast.success("Payment successful. Policy renewed successfully.");

            nav(`/policies/${r.data.id}`, {
              state: {
                renewed: true,
              },
            });
          } catch (e) {
            const message =
              e.response?.data?.message || "Payment verification failed.";

            setError(message);
            toast.error(message);
          } finally {
            setBusy(false);
          }
        },

        modal: {
          ondismiss: () => {
            setBusy(false);
            toast.info("Payment cancelled.");
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (e) {
      const message =
        e.response?.data?.message || "Unable to start renewal payment.";

      setError(message);
      toast.error(message);
      setBusy(false);
    }
  };

  if (!p) {
    return <Loader />;
  }

  return (
    <main className="container narrow">
      <Link to={`/policies/${id}`} className="back-link">
        <ArrowLeft size={16} />
        Back to policy
      </Link>

      <PageHeader
        eyebrow="Renew policy"
        title="Extend your protection"
        subtitle="Renewal recalculates the project-defined premium and creates a new history entry."
      />

      <div className="details-card">
        <div className="renew-preview">
          <div>
            <span>Current expiry</span>
            <strong>{p.expiryDate}</strong>
          </div>

          <div className="renew-arrow">
            <RefreshCw />
          </div>

          <div>
            <span>New term</span>
            <strong>{p.durationYears} year(s)</strong>
          </div>
        </div>

        <div className="info-box">
          <CheckCircle2 />

          <div>
            <b>Eligible policy</b>

            <p>
              Cancelled and cancellation-requested policies cannot be renewed.
            </p>
          </div>
        </div>

        <ErrorBox error={error} />

        <button className="primary-btn full" onClick={renew} disabled={busy}>
          {busy ? "Processing payment..." : "Confirm renewal"}

          <RefreshCw size={16} />
        </button>
      </div>
    </main>
  );
}
