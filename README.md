# Cashone — Personal Finance & Double-Entry Cashflow Ledger

An institutional-grade, privacy-first personal finance platform built with Next.js 16 (App Router + Turbopack), Supabase (PostgreSQL 15+), and Tailwind CSS. Cashone provides atomic double-entry balance integrity, multi-currency FX normalization, budget tracking, recurring transaction automation, statement imports, and receipt storage.

---

## Key Features

1. **Atomic Double-Entry Financial Ledger:**
   - Single-entry income/expense and double-entry account transfers.
   - Guaranteed balance integrity via PostgreSQL triggers (`trg_sync_transaction_balance`).
   - Fee tracking with automated fee deduction on transfer source accounts.
   - Multi-select batch operations (Batch Delete & Export Selected).

2. **Multi-Account & Multi-Currency Management:**
   - Support for Bank Checking, High-Yield Savings, E-Wallets, Cash, and Investments.
   - Dynamic Multi-Currency FX Engine (`USD`, `EUR`, `GBP`, `JPY`, `IDR`, `SGD`, `CAD`, `AUD`).
   - Interactive account statement drawer with lifetime inflow/outflow metrics.

3. **Financial Analytics & Cashflow Trajectory:**
   - Timeframed cashflow aggregation (`7d`, `30d`, `3m`, `6m`, `12m`, `all`).
   - Savings efficiency and savings rate calculations.
   - Category spending distribution and asset allocation charts.
   - Built-in interactive FX Currency Calculator widget.
   - Print-to-PDF executive summary reporting mode (`@media print`).

4. **Monthly Budgets & Category Spending Limits:**
   - Visual threshold indicators: Safe ($<80\%$), Warning ($\ge 80\%$), and Overbudget ($>100\%$).
   - Category management with transaction volume metrics and budget badges.

5. **Recurring Bills & Automated Planner:**
   - Template scheduler for recurring subscriptions, leases, and income.
   - 1-click "Post Now" execution to log instances directly to the ledger.

6. **Bank Statement Importer & Data Export:**
   - CSV and JSON statement parser with preview table and automatic ledger ingestion.
   - Instant CSV and JSON export engine.

7. **Power-User Navigation & Shortcuts:**
   - Universal Command Palette (`⌘K` / `Ctrl+K`) for instant navigation and action triggers.
   - Keyboard Shortcuts Cheatsheet (`?` / `Shift+/`).
   - Receipt inspection lightbox viewer with zoom in/out, 90° rotation, and download links.

8. **Security & Zero-Trust Architecture:**
   - Supabase Auth with secure SSR cookie sessions (`@supabase/ssr`).
   - Strict Row Level Security (RLS) policies on all tables.
   - Private encrypted receipt storage in Supabase Storage.
   - Danger Zone with 2-step `"PURGE"` confirmation to reset personal financial data.

---

## Tech Stack

- **Framework:** Next.js 16.3.3 (App Router, Server Actions, Turbopack)
- **Database:** Supabase PostgreSQL 15+ with PL/pgSQL Triggers & Row Level Security
- **Authentication & Storage:** Supabase Auth & Supabase Storage
- **Styling:** Vanilla CSS, Tailwind CSS, Lucide Icons, Catamaran & Inter typography
- **Testing:** Node.js native test runner (`node:test`)

---

## Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/nawa316/cashone.git
cd cashone
npm install
```

### 2. Environment Variables Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CURRENCY=USD
NEXT_PUBLIC_DEFAULT_LOCALE=en-US
```

### 3. Apply Database Migrations
Run the initial SQL migration against your Supabase PostgreSQL instance:
```bash
PGPASSWORD='<your-db-password>' psql -h <db-host> -p 5432 -U <user> -d postgres -f supabase/migrations/20260901_init_schema.sql
```

### 4. Run Unit Tests & Development Server
```bash
# Run automated unit test suite
npm test

# Start Next.js local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Automated Test Suites

```bash
npm test
```
- `✔ Double-Entry Transfer Math preserves balance minus transaction fees`
- `✔ Double-Entry Transfer with 0 fee has zero systemic variance`
- `✔ Budget status properly flags normal, warning (>=80%), and overbudget (>100%)`
- `✔ Savings Rate accurately computes net surplus and percentage`
- `✔ Multi-Currency FX Engine correctly normalizes foreign balances`
- `✔ CSV Statement Parser properly extracts rows and amounts`
