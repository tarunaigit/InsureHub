# Implementation Notes / Viva Points

## Why this is more than CRUD
Persistent resources such as insurance plans and policies use CRUD-style persistence, but the project also implements business workflows: premium calculation, policy state transitions, renewal rules, cancellation approval, audit history, JWT security, validation, and payment recording.

## Premium simulation

```text
finalPremium = basePremium
             + ageFactor
             + coverageFactor
             + riskFactor
             - discount
```

For the guide's example (age 25, coverage ₹5,00,000, duration 1 year, no discount), the default risk category is MEDIUM so the simulated result is ₹13,000. The formula is intentionally a project-defined simulation and must not be presented as a real insurer underwriting formula.

## Security boundary
The frontend does not decide policy ownership by sending an arbitrary user ID. The backend gets the authenticated identity from JWT/security context and checks the policy owner.

## Payment
The purchase flow supports a keyless local mock payment and a Razorpay mode. Razorpay secret credentials remain backend-only; signature verification is performed on the server.

## Test scenarios
- Valid registration → 201.
- Duplicate email → 409.
- Valid login → JWT.
- Wrong password → 401.
- Customer accesses own policy → 200.
- Customer accesses another user's policy → 403.
- Invalid plan/coverage/duration → 400/404.
- Renew active/expired eligible policy → status/date/history updated.
- Renew cancelled policy → 409.
- Cancellation request → `CANCEL_REQUESTED` + history.
- Admin approval → `CANCELLED` + history.
- Non-admin approval attempt → 403.
- Unknown policy → 404.

## Suggested demo journey
Landing → register/login → plans → premium calculator → purchase → payment → My Policies → history → renew → request cancellation → admin login → approve cancellation → reopen policy → show final history → Swagger.
