# InsureHub — Insurance Policy Management System

A full-stack academic insurance policy management application built around the supplied project guide and InsureHub visual reference. CRUD is used for persistent resources, while the core value is the policy lifecycle: premium calculation, policy purchase, renewal, cancellation request/approval, audit history, JWT authentication, role-based authorization, validation, and payment recording.

## Project structure

```text
insurehub/
├── backend/                    # Spring Boot REST API
├── frontend/                   # React + Vite UI
├── docs/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   ├── screenshots/
│   ├── project-report/
│   └── reference/
├── docker-compose.yml          # PostgreSQL for local development
├── .env.example files
├── .gitignore
└── README.md
```

## Main features

### Customer
- Register and log in with JWT bearer authentication.
- Browse active plans and view plan details.
- Calculate a simulated premium.
- Purchase a policy.
- View own policies and detailed policy data.
- Renew an eligible policy.
- Request cancellation; the policy is not physically deleted.
- View policy history and payment records.
- Search/filter plans and export an admin policy list as CSV.

### Admin
- Protected admin dashboard.
- Create, update and deactivate insurance plans.
- View customers and all policies.
- Review cancellation requests and approve/reject them.
- See operational statistics and export policy data.

### Payment
- `PAYMENT_MODE=mock` gives a zero-key local flow.
- `PAYMENT_MODE=razorpay` creates Razorpay orders server-side and verifies the payment signature server-side.
- Add your Razorpay test/live credentials only when you are ready. The secret key belongs only in `backend/.env`.

## Technology approach

The backend follows Controller → Service → Repository → PostgreSQL layering, with entities and DTOs separated from HTTP concerns. Security is isolated under `security/`, and predictable failures are converted into consistent JSON by `GlobalExceptionHandler`.

The frontend is component-based and keeps API calls in `src/services/api.js`; it does not contain database logic.

## Compatibility strategy

The project intentionally uses standards-based APIs and simple Spring/React patterns instead of relying on experimental framework features.

- Backend baseline: Java 17+ with Spring Boot 4.0.5. The code uses mainstream Spring/Jakarta APIs and avoids version-specific experimental features.
- Frontend baseline: Node 20.19+ (or Node 22.12+). Vite 8 supports these current Node lines; package dependencies use semver ranges instead of exact package pins.
- PostgreSQL: use a supported PostgreSQL release; the supplied Docker Compose uses PostgreSQL 16 for wide ecosystem compatibility.
- Spring Boot is pinned at 4.0.5 for a reproducible baseline, while frontend packages use semver ranges. This is intentionally not tied to one machine or one exact minor/patch release; upgrade the dependency set as a group when moving to another major framework generation.

The supplied guide itself points to the official React, Spring Boot, Spring Security and springdoc documentation and notes that Create React App is deprecated; this project therefore uses Vite rather than CRA.

## 1. Start PostgreSQL

### Option A — Docker (full stack)

```bash
docker compose up --build
```

Then open `http://localhost:5173`. The API is at `http://localhost:8080/api`.

To start only PostgreSQL and run Java/React locally:

```bash
docker compose up -d postgres
```

### Option B — Existing PostgreSQL

Create a database named `insurehub`, then put its JDBC URL/user/password into `backend/.env`.


## Fresh local database reset

If you previously started an older version of this project against the same `insurehub` database, Hibernate may report errors about adding new non-null columns to existing rows. For this student project, the simplest fix is to reset the local project database once, then restart the backend.

### Docker PostgreSQL

```powershell
docker compose down -v
docker compose up -d postgres
```

**Warning:** `down -v` deletes the PostgreSQL Docker volume. Use this only for the project database when you do not need the existing local data.

### Existing PostgreSQL installation

Drop and recreate the `insurehub` database (or run the supplied reset script in `docs/database/reset-local-db.sql`) before the first clean application start.

After the reset, keep `spring.jpa.hibernate.ddl-auto=update`; Hibernate will create the current tables and `DataInitializer` will seed the demo users and plans.

## 2. Configure the backend

```bash
cd backend
copy .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

For a first run, keep:

```text
PAYMENT_MODE=mock
```

Change `JWT_SECRET` to a long random value. Do not commit `.env`.

## 3. Run the backend

You need a JDK 17+ and Maven 3.9+ (or run the backend through your preferred Maven/Docker workflow).

```bash
cd backend
mvn spring-boot:run
```

API base: `http://localhost:8080/api`

Swagger UI: `http://localhost:8080/swagger-ui.html`

Health: `http://localhost:8080/actuator/health`

## 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown by the terminal, normally `http://localhost:5173`.

## Demo accounts

The backend seeds these accounts when the database is empty:

```text
Customer
email: demo@insurehub.local
password: Demo@12345

Admin
email: admin@insurehub.local
password: Admin@12345
```

Change or remove seeded credentials before any deployment outside local development.

## API workflow

1. Register/login → JWT.
2. Browse plans.
3. Calculate premium.
4. Create/purchase policy.
5. Create or confirm payment record.
6. View policy/history.
7. Renew eligible policy.
8. Request cancellation.
9. Admin reviews request and approves/rejects it.
10. Policy history records each important transition.

## Required API endpoints

See [`docs/api/API_CONTRACT.md`](docs/api/API_CONTRACT.md).

## Database

See [`docs/database/ERD.md`](docs/database/ERD.md). The core model is:

`USER 1:N POLICY`, `INSURANCE_PLAN 1:N POLICY`, `POLICY 1:N POLICY_HISTORY`, `POLICY 1:N PAYMENT`.

## Premium formula

The supplied guide defines this as an educational simulation:

`finalPremium = basePremium + ageFactor + coverageFactor + riskFactor - discount`

It is not intended to model a real insurer's underwriting formula.

## External website references

The UI journey is informed by common real-world insurance product patterns such as plan discovery/comparison, policy renewal and self-service policy management. See the documentation reference file for the specific sources used while shaping the project.

## Security notes

- Passwords are stored as BCrypt hashes, never plaintext.
- The backend derives the authenticated user from the JWT/security context instead of trusting a client-supplied `userId`.
- Razorpay secret credentials must never be placed in `frontend/.env` or any `VITE_*` variable.
- Use test/sandbox gateway credentials during development.

## Useful files

- `backend/.env.example` — server configuration template.
- `frontend/.env.example` — browser-safe configuration template.
- `docs/api/API_CONTRACT.md` — endpoint contract.
- `docs/architecture/ARCHITECTURE.md` — architecture and workflow.
- `docs/database/ERD.md` — database relationships.
- `docs/project-report/IMPLEMENTATION_NOTES.md` — project/report talking points.

## Disclaimer

This is an educational project/simulation. It does not constitute an insurance product, financial advice, or a production-ready underwriting system.

## Authentication

InsureHub uses one shared login page for both customers and administrators. The authenticated role returned by the backend determines the destination and permissions; there is no separate "login as admin/user" selector.

Google Sign-In is supported through Google Identity Services. Set `VITE_GOOGLE_CLIENT_ID` in the frontend and `GOOGLE_CLIENT_ID` in the backend to the same OAuth 2.0 Web client ID. The frontend sends Google's ID token to `POST /api/auth/google`, and the backend verifies the issuer, audience and token validity before issuing the InsureHub JWT.
