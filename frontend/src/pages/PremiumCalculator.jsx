import {
    useEffect,
    useState
} from 'react';

import {
    useSearchParams,
    useNavigate
} from 'react-router-dom';

import {
    Calculator,
    IndianRupee,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';

import {
    planApi,
    quoteApi
} from '../services/api';

import {
    useAuth
} from '../context/AuthContext';

import PageHeader
    from '../components/PageHeader';

import ErrorBox
    from '../components/ErrorBox';

export default function PremiumCalculator() {

    const [params] =
        useSearchParams();

    const nav =
        useNavigate();

    const { user } =
        useAuth();

    const [plans, setPlans] =
        useState([]);

    const [form, setForm] =
        useState({
            planId:
                params.get('planId') || '',
            age: 25,
            coverageAmount: 500000,
            durationYears: 1,
            riskCategory: 'MEDIUM'
        });

    const [quote, setQuote] =
        useState(null);

    const [error, setError] =
        useState('');

    const [busy, setBusy] =
        useState(false);

    useEffect(() => {

        planApi.list()
            .then(response => {

                setPlans(
                    response.data
                );

                if (
                    !form.planId &&
                    response.data[0]
                ) {

                    setForm(current => ({
                        ...current,
                        planId:
                            String(
                                response
                                    .data[0]
                                    .id
                            ),
                        coverageAmount:
                            response
                                .data[0]
                                .coverageAmount,
                        durationYears:
                            Math.min(
                                1,
                                response
                                    .data[0]
                                    .durationYears
                            )
                    }));
                }
            });

    }, []);

    useEffect(() => {

        const selected =
            plans.find(
                plan =>
                    String(plan.id) ===
                    String(form.planId)
            );

        if (
            selected &&
            !params.get('planId')
        ) {

            setForm(current => ({
                ...current,
                coverageAmount:
                    selected.coverageAmount,
                durationYears:
                    Math.min(
                        current.durationYears,
                        selected.durationYears
                    )
            }));
        }

    }, [
        form.planId,
        plans,
        params
    ]);

    const selected =
        plans.find(
            plan =>
                String(plan.id) ===
                String(form.planId)
        );

    const calculate =
        async event => {

            event.preventDefault();

            setBusy(true);
            setError('');

            try {

                const response =
                    await quoteApi.calculate({
                        planId:
                            Number(
                                form.planId
                            ),
                        age:
                            Number(
                                form.age
                            ),
                        coverageAmount:
                            Number(
                                form.coverageAmount
                            ),
                        durationYears:
                            Number(
                                form.durationYears
                            ),
                        riskCategory:
                            form.riskCategory
                    });

                setQuote(
                    response.data
                );

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    'Could not calculate premium.'
                );

            } finally {

                setBusy(false);
            }
        };

    const buy = () => {

        if (!user) {

            nav(
                '/login',
                {
                    state: {
                        from:
                            '/calculator'
                    }
                }
            );

            return;
        }

        nav(
            `/purchase?planId=${form.planId}`,
            {
                state: {
                    quote,
                    form
                }
            }
        );
    };

    return (
        <main className="container narrow">

            <PageHeader
                eyebrow="Premium calculator"
                title="Know your estimated premium"
                subtitle="This is a project-defined simulation, not a real insurer underwriting formula."
            />

            <div className="calculator-layout">

                <form
                    className="details-card form-card"
                    onSubmit={calculate}
                >

                    <div className="form-section">

                        <h3>
                            <Calculator
                                size={19}
                            />
                            Quote inputs
                        </h3>

                        <label>
                            Insurance plan

                            <select
                                value={
                                    form.planId
                                }
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        planId:
                                            e.target.value
                                    })
                                }
                            >

                                {plans.map(plan =>
                                    <option
                                        key={plan.id}
                                        value={plan.id}
                                    >
                                        {plan.name}
                                    </option>
                                )}

                            </select>
                        </label>

                        <label>
                            Age

                            <input
                                type="number"
                                min="18"
                                max="100"
                                value={
                                    form.age
                                }
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        age:
                                            e.target.value
                                    })
                                }
                            />
                        </label>

                        <label>
                            Coverage amount

                            <input
                                type="number"
                                min="1"
                                value={
                                    form.coverageAmount
                                }
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        coverageAmount:
                                            e.target.value
                                    })
                                }
                            />

                            {selected && (
                                <small className="field-note">
                                    Allowed: ₹
                                    {Number(
                                        selected
                                            .minCoverageAmount
                                    ).toLocaleString(
                                        'en-IN'
                                    )}
                                    {' – '}
                                    ₹
                                    {Number(
                                        selected
                                            .maxCoverageAmount
                                    ).toLocaleString(
                                        'en-IN'
                                    )}
                                </small>
                            )}
                        </label>

                        <label>
                            Duration

                            <select
                                value={
                                    form.durationYears
                                }
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        durationYears:
                                            Number(
                                                e.target
                                                    .value
                                            )
                                    })
                                }
                            >

                                {Array.from(
                                    {
                                        length:
                                            selected
                                                ?.durationYears ||
                                            1
                                    },
                                    (_, index) =>
                                        <option
                                            key={
                                                index + 1
                                            }
                                            value={
                                                index + 1
                                            }
                                        >
                                            {index + 1}
                                            {' '}
                                            year
                                            {
                                                index
                                                    ? 's'
                                                    : ''
                                            }
                                        </option>
                                )}

                            </select>
                        </label>

                        <label>
                            Risk category

                            <select
                                value={
                                    form.riskCategory
                                }
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        riskCategory:
                                            e.target.value
                                    })
                                }
                            >
                                <option>
                                    LOW
                                </option>

                                <option>
                                    MEDIUM
                                </option>

                                <option>
                                    HIGH
                                </option>
                            </select>
                        </label>

                        <div className="field-note">
                            Any eligible discount is
                            determined by the server.
                            It cannot be edited from
                            the customer screen.
                        </div>

                        <ErrorBox
                            error={error}
                        />

                        <button
                            className="primary-btn full"
                            disabled={busy}
                        >
                            {busy
                                ? 'Calculating...'
                                : 'Calculate premium'}

                            <ArrowRight
                                size={16}
                            />
                        </button>

                    </div>

                </form>

                {quote ? (

                    <div className="quote-card">

                        <div className="quote-head">

                            <span className="eyebrow">
                                Estimated premium
                            </span>

                            <div className="quote-total">
                                <IndianRupee />

                                {' '}

                                {Number(
                                    quote.finalPremium
                                ).toLocaleString(
                                    'en-IN'
                                )}
                            </div>

                        </div>

                        <div className="quote-lines">

                            <Row
                                label="Base premium"
                                v={
                                    quote.basePremium
                                }
                            />

                            <Row
                                label="Age factor"
                                v={
                                    quote.ageFactor
                                }
                            />

                            <Row
                                label="Coverage factor"
                                v={
                                    quote.coverageFactor
                                }
                            />

                            <Row
                                label="Risk factor"
                                v={
                                    quote.riskFactor
                                }
                            />

                            <Row
                                label="Discount"
                                v={
                                    -quote.discount
                                }
                            />

                        </div>

                        <div className="quote-note">

                            <ShieldCheck
                                size={18}
                            />

                            <span>
                                Any discount shown here
                                was determined by the
                                server based on your
                                eligibility.
                            </span>

                        </div>

                        <button
                            className="primary-btn full"
                            onClick={buy}
                        >
                            Continue to purchase

                            <ArrowRight
                                size={16}
                            />
                        </button>

                    </div>

                ) : (

                    <div className="quote-empty">

                        <Calculator
                            size={38}
                        />

                        <h3>
                            Your estimate appears here
                        </h3>

                        <p>
                            Fill the form and calculate
                            to see the breakdown used
                            by this project.
                        </p>

                    </div>
                )}

            </div>

        </main>
    );
}

const Row = ({
    label,
    v
}) => (
    <div className="quote-row">

        <span>
            {label}
        </span>

        <b>
            ₹
            {Number(v)
                .toLocaleString('en-IN')}
        </b>

    </div>
);