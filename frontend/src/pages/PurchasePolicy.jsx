import {
    useEffect,
    useState
} from 'react';

import {
    useLocation,
    useNavigate,
    useSearchParams
} from 'react-router-dom';

import {
    ShieldCheck,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

import toast
    from 'react-hot-toast';

import {
    planApi,
    policyApi,
    paymentApi
} from '../services/api';

import ErrorBox
    from '../components/ErrorBox';

import PageHeader
    from '../components/PageHeader';

export default function PurchasePolicy() {

    const [params] =
        useSearchParams();

    const loc =
        useLocation();

    const nav =
        useNavigate();

    const [plan, setPlan] =
        useState(null);

    const passed =
        loc.state?.form || {};

    const quote =
        loc.state?.quote;

    const [form, setForm] =
        useState({
            ...passed,
            planId:
                params.get('planId') ||
                passed.planId ||
                ''
        });

    const [policy, setPolicy] =
        useState(null);

    const [order, setOrder] =
        useState(null);

    const [error, setError] =
        useState('');

    const [busy, setBusy] =
        useState(false);

    useEffect(() => {

        if (form.planId) {

            planApi
                .get(form.planId)
                .then(response =>
                    setPlan(
                        response.data
                    )
                );
        }

    }, [
        form.planId
    ]);

    const purchase =
        async () => {

            setBusy(true);
            setError('');

            try {

                /*
                 * IMPORTANT:
                 * No discountPercent is sent here.
                 */
                const response =
                    await policyApi.purchase({
                        planId:
                            Number(
                                form.planId
                            ),

                        coverageAmount:
                            Number(
                                form.coverageAmount
                            ),

                        durationYears:
                            Number(
                                form.durationYears
                            ),

                        age:
                            Number(
                                form.age || 30
                            ),

                        riskCategory:
                            form.riskCategory ||
                            'MEDIUM'
                    });

                const createdPolicy =
                    response.data;

                setPolicy(
                    createdPolicy
                );

                const orderResponse =
                    await paymentApi.order(
                        createdPolicy.id
                    );

                const createdOrder =
                    orderResponse.data;

                setOrder(
                    createdOrder
                );

                toast.success(
                    `Policy ${createdPolicy.policyNumber} created.`
                );

                if (
                    createdOrder.mode ===
                    'razorpay'
                ) {

                    toast(
                        'Opening secure payment…',
                        {
                            icon: '💳'
                        }
                    );

                    openRazorpay(
                        createdOrder,
                        createdPolicy
                    );

                } else {

                    await verifyMock(
                        createdOrder,
                        createdPolicy
                    );
                }

            } catch (e) {

                const message =
                    e.response?.data?.message ||
                    'Purchase failed.';

                setError(
                    message
                );

                toast.error(
                    message
                );

            } finally {

                setBusy(false);
            }
        };

    const verifyMock =
        async (
            orderData,
            policyData
        ) => {

            const response =
                await paymentApi.verify({
                    policyId:
                        policyData.id,

                    orderId:
                        orderData.orderId,

                    paymentId:
                        `mock_pay_${Date.now()}`,

                    signature:
                        'mock'
                });

            toast.success(
                'Payment recorded successfully.'
            );

            nav(
                `/policies/${policyData.id}`,
                {
                    state: {
                        purchaseSuccess:
                            true,
                        payment:
                            response.data
                    }
                }
            );
        };

    const openRazorpay =
        (
            orderData,
            policyData
        ) => {

            const script =
                document.createElement(
                    'script'
                );

            script.src =
                'https://checkout.razorpay.com/v1/checkout.js';

            script.onload = () => {

                const razorpay =
                    new window.Razorpay({
                        key:
                            orderData.keyId,

                        amount:
                            Math.round(
                                Number(
                                    orderData.amount
                                ) * 100
                            ),

                        currency:
                            orderData.currency,

                        name:
                            'InsureHub',

                        description:
                            `Premium for ${policyData.policyNumber}`,

                        order_id:
                            orderData.orderId,

                        handler:
                            async response => {

                                try {

                                    const verified =
                                        await paymentApi.verify({
                                            policyId:
                                                policyData.id,

                                            orderId:
                                                response.razorpay_order_id,

                                            paymentId:
                                                response.razorpay_payment_id,

                                            signature:
                                                response.razorpay_signature
                                        });

                                    toast.success(
                                        'Payment verified successfully.'
                                    );

                                    nav(
                                        `/policies/${policyData.id}`,
                                        {
                                            state: {
                                                purchaseSuccess:
                                                    true,
                                                payment:
                                                    verified.data
                                            }
                                        }
                                    );

                                } catch (e) {

                                    const message =
                                        e.response?.data?.message ||
                                        'Payment verification failed.';

                                    setError(
                                        message
                                    );

                                    toast.error(
                                        message
                                    );
                                }
                            },

                        prefill: {
                            email: '',
                            name: ''
                        },

                        theme: {
                            color:
                                '#1b8eea'
                        }
                    });

                razorpay.open();
            };

            document.body.appendChild(
                script
            );
        };

    if (!plan) {

        return (
            <main className="container narrow">

                <PageHeader
                    eyebrow="Purchase"
                    title="Confirm your policy"
                />

            </main>
        );
    }

    return (
        <main className="container narrow">

            <PageHeader
                eyebrow="Purchase policy"
                title="Review and secure your cover"
                subtitle="The final premium is recalculated by the backend using your server-side discount eligibility."
            />

            <div className="purchase-card">

                <div className="purchase-plan">

                    <div className="purchase-logo">

                        <ShieldCheck />

                    </div>

                    <div>

                        <span className="eyebrow">
                            {plan.type}
                        </span>

                        <h2>
                            {plan.name}
                        </h2>

                        <p>
                            {plan.description}
                        </p>

                    </div>

                </div>

                <div className="purchase-summary">

                    <Summary
                        label="Coverage"
                        v={
                            `₹${Number(
                                form.coverageAmount ||
                                plan.coverageAmount
                            ).toLocaleString(
                                'en-IN'
                            )}`
                        }
                    />

                    <Summary
                        label="Duration"
                        v={
                            `${form.durationYears ||
                            plan.durationYears} year(s)`
                        }
                    />

                    <Summary
                        label="Risk"
                        v={
                            form.riskCategory ||
                            'MEDIUM'
                        }
                    />

                    <Summary
                        label="Server-approved discount"
                        v={
                            quote?.discount
                                ? `₹${Number(
                                    quote.discount
                                ).toLocaleString(
                                    'en-IN'
                                )}`
                                : '₹0'
                        }
                    />

                    <Summary
                        label="Estimated premium"
                        v={
                            `₹${Number(
                                quote?.finalPremium ||
                                0
                            ).toLocaleString(
                                'en-IN'
                            )}`
                        }
                    />

                </div>

                <ErrorBox
                    error={error}
                />

                {policy && (

                    <div className="success-box">

                        <CheckCircle2 />

                        Policy{" "}
                        {policy.policyNumber}
                        {" "}created.

                        {' '}

                        {order?.mode ===
                        'mock'
                            ? 'Recording a mock payment...'
                            : 'Opening secure Razorpay checkout...'
                        }

                    </div>
                )}

                {!policy && (

                    <button
                        className="primary-btn full"
                        onClick={
                            purchase
                        }
                        disabled={busy}
                    >

                        {busy
                            ? 'Creating policy...'
                            : 'Confirm & continue to payment'
                        }

                        <ArrowRight
                            size={16}
                        />

                    </button>
                )}

                <p className="fine-print">
                    The premium and discount are
                    calculated again by the backend
                    during purchase.
                </p>

            </div>

        </main>
    );
}

const Summary = ({
    label,
    v
}) => (

    <div className="summary-item">

        <span>
            {label}
        </span>

        <b>
            {v}
        </b>

    </div>
);