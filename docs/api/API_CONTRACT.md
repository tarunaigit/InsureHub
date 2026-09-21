# InsureHub API Contract

Base URL: `/api`

Authentication: protected endpoints use `Authorization: Bearer <JWT>`.

## Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create customer account |
| POST | `/auth/login` | Public | Authenticate and return JWT |
| POST | `/auth/google` | Public | Verify Google ID token and return InsureHub JWT |
| GET | `/auth/me` | Authenticated | Return current user |

## Plans

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/plans` | Public | List active plans |
| GET | `/plans/{id}` | Public | Plan details |
| POST | `/plans` | ADMIN | Create plan |
| PUT | `/plans/{id}` | ADMIN | Update plan |
| DELETE | `/plans/{id}` | ADMIN | Soft-deactivate plan |

## Quotes and policy lifecycle

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/quotes/calculate` | Authenticated | Calculate simulated premium |
| POST | `/policies` | Customer | Purchase policy |
| GET | `/policies/my` | Authenticated | Current customer's policies |
| GET | `/policies/{id}` | Owner/ADMIN | Policy details |
| POST | `/policies/{id}/renew` | Owner | Renew eligible policy |
| POST | `/policies/{id}/cancel` | Owner | Request cancellation |
| GET | `/policies/{id}/history` | Owner/ADMIN | Audit trail |

## Admin workflow

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/admin/stats` | ADMIN | Operational statistics |
| GET | `/admin/users` | ADMIN | Customers/users |
| GET | `/admin/policies` | ADMIN | All policies |
| GET | `/admin/plans` | ADMIN | All plans |
| GET | `/admin/cancellation-requests` | ADMIN | Pending cancellation requests |
| PUT | `/admin/cancellation-requests/{id}/approve` | ADMIN | Approve request |
| PUT | `/admin/cancellation-requests/{id}/reject` | ADMIN | Reject request |

## Payment

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/payments/order` | Policy owner | Create mock or Razorpay order |
| POST | `/payments/verify` | Policy owner | Verify mock/Razorpay payment |
| GET | `/payments/policy/{policyId}` | Owner/ADMIN | Payment history |

## Purchase request

```json
{
  "planId": 2,
  "coverageAmount": 500000,
  "durationYears": 1,
  "age": 25,
  "riskCategory": "MEDIUM",
  "discountPercent": 0
}
```

## Policy response example

```json
{
  "id": 182,
  "policyNumber": "INS-2026-AB12CD34",
  "planName": "Health Secure Plus",
  "planType": "HEALTH",
  "premium": 13000,
  "coverageAmount": 500000,
  "durationYears": 1,
  "age": 25,
  "riskCategory": "MEDIUM",
  "startDate": "2026-09-17",
  "expiryDate": "2027-09-16",
  "status": "ACTIVE"
}
```

## Status transitions

```text
QUOTED → ACTIVE → RENEWED → EXPIRED
                  ↘
                    CANCEL_REQUESTED → CANCELLED
                         ↘ (admin rejects)
                          previous valid state
```

## Common errors

```json
{
  "timestamp": "2026-09-17T19:30:00",
  "status": 409,
  "error": "INVALID_POLICY_STATE",
  "message": "Policy cannot be renewed in its current state."
}
```

Expected status families include 200, 201, 400, 401, 403, 404, 409 and 500.
