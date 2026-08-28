# Testing, QA & Deployment Guide
## Cashone — Personal Finance & Cashflow Tracker

This document outlines the testing strategy, test suites, Vercel deployment procedures, and Supabase database migration workflows.

---

## 1. Testing Strategy & Test Suites

### 1.1. Unit & Formula Testing
Key financial formulas requiring automated unit tests:
1. **Double-Entry Transfer Math:**
   * Source Balance decreases by $(Amount + Fee)$.
   * Destination Balance increases by $Amount$.
   * Total system balance change equals $-Fee$.
2. **Multi-Currency FX Normalization:**
   * Base rate pegged conversion across USD, EUR, GBP, JPY, IDR, SGD, CAD, AUD.
   * Consolidated Net Worth aggregation across mixed currency accounts.
3. **Category Budget Threshold & Alerts:**
   * Safe allocation: $\text{Spent} \le 80\% \times \text{Limit}$.
   * Warning threshold: $80\% < \text{Spent} \le 100\%$.
   * Over-budget alert: $\text{Spent} > \text{Limit}$.
4. **Savings Rate Calculation:**
   * $\text{Net Savings} = \text{Inflow} - \text{Outflow}$.
   * $\text{Savings Rate} = (\text{Net Savings} / \text{Inflow}) \times 100\%$.

### 1.2. Integration & Database Trigger Tests
Using Node.js test runner and Supabase integration tests:
* Verify `sync_account_balance_on_transaction()` handles batch updates and reverts correctly on transaction delete.
* Verify RLS prevents User B from reading or querying User A's transactions.

---

## 2. Supabase Migration & Local Development Workflow

### 2.1. Local Environment Setup
```bash
# 1. Initialize Supabase locally
npx supabase init

# 2. Start local PostgreSQL and Supabase services (Docker required)
npx supabase start

# 3. Create a new migration for schemas & triggers
npx supabase migration new init_cashone_schema

# 4. Apply migrations to local instance
npx supabase db reset

# 5. Generate updated TypeScript types from schema
npx supabase gen types typescript --local > types/database.types.ts
```

### 2.2. Production Database Deployment
```bash
# Link local CLI to remote Supabase project
npx supabase link --project-ref <your-project-ref>

# Push local migrations to production
npx supabase db push
```

---

## 3. Vercel Production Deployment & CI/CD Guide

Cashone is deployed natively to **Vercel**, taking advantage of Next.js 16 Server Components, Server Actions, Edge Middleware, and automatic preview deployments.

### 3.1. Prerequisites
1. **GitHub / GitLab Repository:** Push the `cashone` repository to your Git provider.
2. **Supabase Cloud Project:** A production Supabase project configured with your schema, RLS policies, and storage buckets.
3. **Vercel Account:** Linked to your Git provider.

---

### 3.2. Step-by-Step Vercel Deployment

#### Option A: Via Vercel Dashboard (Recommended)
1. Navigate to [vercel.com/new](https://vercel.com/new).
2. Import the `cashone` repository.
3. Framework Preset will auto-detect **Next.js**.
4. Configure **Environment Variables** in the Vercel project settings:
   ```ini
   NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_APP_URL=https://cashone.vercel.app (or custom domain)
   NEXT_PUBLIC_DEFAULT_CURRENCY=USD
   NEXT_PUBLIC_DEFAULT_LOCALE=en-US
   ```
5. Click **Deploy**. Vercel will build and deploy the Next.js 16 application.

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Link project and deploy preview
vercel

# Deploy to production
vercel --prod
```

---

### 3.3. Supabase Auth URL Configuration for Vercel
To ensure authentication redirects (OAuth, password reset, email confirmation) work seamlessly:
1. In your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**:
   * **Site URL:** Set to `https://your-custom-domain.com` or `https://cashone.vercel.app`.
   * **Redirect URLs:** Add wildcard URLs for Vercel Preview deployments:
     * `https://cashone-*.vercel.app/**`
     * `https://your-custom-domain.com/**`
     * `http://localhost:3000/**`

---

### 3.4. Next.js 16 Build & Performance Optimization on Vercel
* **Standalone Output:** Next.js optimizes bundle sizes automatically for Vercel serverless functions.
* **Edge Middleware:** Session refresh and authentication route protection run instantly on Vercel's global Edge network.
* **Dynamic Server Actions:** All ledger transactions and recurring schedules execute securely in isolated Node.js serverless functions with zero cold-start overhead.
* **Cache Invalidation:** Server Actions use `revalidatePath()` and `revalidateTag()` to purge and refresh Vercel's Data Cache instantly upon database mutations.

