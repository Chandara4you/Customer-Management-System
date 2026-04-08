# HopePMS — Customer Management System

**Group 2 · New Era University · CCS**
**Sub-system of HopePMS (HOPE, Inc. Product Management System)**

Sprint 1 deliverable: read-only customer browsing, auth scaffolding, and role-based shell.

---

## Team

| Role | Member | Branches |
|---|---|---|
| M1 — Project Lead | Christian P. Adlawan | `feat/project-scaffold` |
| M2 — Frontend Dev | Jomar A. Auditor | `feat/routing-skeleton`, `feat/ui-login-page`, `feat/ui-register-page`, `feat/ui-customer-list`, `feat/ui-customer-detail` |
| M3 — DB Engineer | Gabriel B. Antonino | `feat/supabase-client`, `db/customer-record-status-migration` |
| M4 — Auth Specialist | Wayne Andy Y. Villamor | `feat/auth-context`, `feat/ui-auth-callback` |
| M5 — QA / Docs | Trixian Wackyll C. Granado | `test/sprint1-auth-flows`, `docs/sprint1-readme` |

Every file in `src/` has a branch-ownership comment on line 1. When assembling PRs, filter by that comment.

---

## Tech stack

- React 18 + Vite 5
- Tailwind CSS v3
- React Router v6
- Supabase JS v2 (auth, Postgres)
- react-hook-form + zod
- lucide-react (icons)
- Vitest + React Testing Library

Node 18 or higher.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure Supabase credentials
cp .env.example .env
# Open .env and paste the values from:
#   https://supabase.com/dashboard/project/josngoksjnmpibblxufw
#   → Settings → API → Project URL + anon public key

# 3. Run the Sprint 1 database migration
#    Open Supabase SQL editor and paste the contents of:
#      db/migrations/001_add_customer_record_status.sql
#    (This adds the record_status column to the customer table.)

# 4. Start the dev server
npm run dev
# → http://localhost:5173

# 5. Run tests
npm test          # watch mode
npm run test:run  # single pass (use in CI)
```

---

## Sprint 1 scope

### In scope (shipped)

- **Auth flow** — email/password sign-up and sign-in, Google OAuth, email confirmation, auth callback, session persistence
- **Login guard** — any user whose `public.user.record_status !== 'ACTIVE'` is immediately signed out with the message *"Your account is inactive. Please contact an administrator."* New registrations arrive as `USER` / `INACTIVE` via the Supabase `provision_new_user()` trigger.
- **Role-based sidebar visibility**
  - `USER` → `/customers`, `/reports`
  - `ADMIN` → `/customers`, `/reports`, `/deleted-items`
  - `SUPERADMIN` → all of the above plus `/admin`
- **Customer list** — search (custno / custname / address), client-side pagination (10 per page), payterm badges (COD amber, 30D blue, 45D emerald), skeleton loader, empty state, row links to detail page
- **Customer detail** — dedicated route at `/customers/:custNo`, fetches by primary key, displays all fields
- **Reports dashboard** — total customer count + COD / 30D / 45D breakdown cards + distribution bars. Customer table only, no other HopeDB tables touched.
- **Database migration** — `record_status VARCHAR(8) CHECK IN ('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'` added to the customer table, indexed for query stability
- **Soft-delete service logic** — `softDeleteCustomer()` exported and ready for Sprint 2 UI integration
- **Unit tests** — login guard (ACTIVE passes, INACTIVE blocked + signOut called + correct error message), customerService (getCustomers returns array, searchCustomers filters, createCustomer rejects invalid payterm)

### Deferred to Sprint 2

- Add / Edit / Delete customer UI. The "Add Customer" button renders in `CustomerList.jsx` and the "Edit" button renders in `CustomerDetail.jsx`, both with a *"Coming in Sprint 2"* tooltip on hover.
- `/deleted-items` populated list + restore action (page is a placeholder; the DB column and service function are already in place so Sprint 2 only needs UI work).
- `/admin` user activation panel (SUPERADMIN-only). Route-level guard will be added in Sprint 2; for Sprint 1 the sidebar link is already hidden from non-SUPERADMINs.

---

## Project structure

```
hopepms-cms/
├── db/
│   └── migrations/
│       └── 001_add_customer_record_status.sql
├── docs/
│   └── SPRINT1_README.md          ← you are here
├── src/
│   ├── config/
│   │   └── supabaseClient.js      ← single source of truth for Supabase
│   ├── context/
│   │   ├── AuthContext.jsx        ← session + login guard
│   │   └── AuthContext.test.jsx
│   ├── components/
│   │   ├── routing/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/
│   │   │   ├── AppShell.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx        ← role-based nav visibility lives here
│   │   └── ui/
│   │       ├── LoadingSpinner.jsx
│   │       └── PageLoader.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AuthCallback.jsx
│   │   ├── customers/
│   │   │   ├── CustomerList.jsx
│   │   │   └── CustomerDetail.jsx
│   │   ├── reports/
│   │   │   └── Reports.jsx
│   │   ├── admin/
│   │   │   └── Admin.jsx
│   │   └── deleted/
│   │       └── DeletedItems.jsx
│   ├── services/
│   │   ├── customerService.js     ← all customer table ops, { data, error }
│   │   └── customerService.test.js
│   ├── hooks/
│   │   └── useCustomers.js
│   ├── utils/
│   │   └── constants.js
│   ├── test/
│   │   └── setup.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Code quality rules (enforced — do not break in Sprint 2)

1. **`supabaseClient.js` is the single Supabase instance.** Never call `createClient()` anywhere else.
2. **`AuthContext` is the single source of session state.** No page component should call `supabase.auth.getSession()` directly.
3. **All service functions return `{ data, error }`.** Never throw raw Supabase errors. Always log via `console.error('functionName:', ...)` inside `catch` blocks.
4. **Zod schemas live at module level**, not inside components.
5. **`useEffect` cleanup** is mandatory for any subscription, listener, or async work that can resolve after unmount.
6. **Tailwind only.** No inline `style={{}}` objects.
7. **Responsive at `sm:` / `md:` / `lg:`.**
8. **No `console.log`.** `console.error` only, inside `catch`.
9. **Every `src/` file has a branch-ownership comment on line 1** so PR filtering stays clean.
10. **Customer sub-system scope** — the frontend touches the `customer` table only. Do not query `sales`, `payment`, or any other HopeDB table from this sub-system.

---

## PR workflow

Each team member works on their assigned branches listed in the Team table. When ready:

1. Push your branch to the repo
2. Open a PR against `main`
3. Tag Christian (M1) for review
4. Wackyll (M5) runs `npm run test:run` against the branch and confirms all tests pass before merge

Merge order matters for Sprint 1 to avoid conflicts:

1. `feat/project-scaffold` (Christian)
2. `db/customer-record-status-migration` (Gabriel) — run against Supabase before frontend merges
3. `feat/supabase-client` (Gabriel)
4. `feat/auth-context` (Wayne)
5. `feat/routing-skeleton` (Jomar)
6. `feat/ui-login-page`, `feat/ui-register-page`, `feat/ui-auth-callback` (Jomar + Wayne)
7. `feat/ui-customer-list`, `feat/ui-customer-detail` (Jomar)
8. `test/sprint1-auth-flows`, `docs/sprint1-readme` (Wackyll)

---

## Troubleshooting

**"Missing VITE_SUPABASE_URL" in console** — Copy `.env.example` to `.env` and fill in both values. Restart the dev server after editing `.env` (Vite only reads env files at startup).

**"Your account is inactive" after signing up** — Expected. The `provision_new_user()` trigger creates new users as `USER` / `INACTIVE`. A SUPERADMIN must manually update `public.user.record_status` to `'ACTIVE'` via the Supabase dashboard. In Sprint 2 this will be handled by the `/admin` panel.

**Customer list is empty after the migration** — Verify the migration ran successfully: `SELECT custno, record_status FROM customer LIMIT 5;` in the Supabase SQL editor. All rows should show `ACTIVE`.

**Google OAuth redirect fails** — In the Supabase dashboard, confirm the redirect URL `http://localhost:5173/auth/callback` is listed under Authentication → URL Configuration → Redirect URLs. For production, add the deployed origin too.
