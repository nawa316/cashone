# System Architecture & Technical Specification
## Cashone — Personal Finance & Cashflow Tracker

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL 15+, Auth, RLS, Storage)  
**Target Environment:** Vercel (Next.js Edge & Serverless Runtime) + Supabase Cloud  
**Document Version:** 2.0.0  

---

## 1. High-Level Architecture Overview

```mermaid
graph TD
    Client["Browser / Client (React 19 + Tailwind v4 + Catamaran Font)"]

    subgraph NextJS["Next.js 16 Application (App Router)"]
        direction TB
        Middleware["Next.js Middleware (Auth Session Refresh & Route Guards)"]
        RSC["React Server Components (SSR & Initial Data Fetching)"]
        RCC["React Client Components (Interactive Dashboards, Charts & Forms)"]
        ServerActions["Server Actions (Mutations & Ledger Operations)"]
        RouteHandlers["Route Handlers / API (Export/Import, Webhooks)"]
        ZodSchemas["Zod Validation Layer"]
    end

    subgraph Supabase["Supabase Cloud Platform"]
        direction TB
        SupaAuth["Supabase Auth (JWT & Session Management)"]
        SupaDB["PostgreSQL 15+ (Relational Database)"]
        SupaRLS["Row Level Security (Tenant Isolation)"]
        SupaTriggers["Database Triggers (Atomic Balance Sync)"]
        SupaStorage["Supabase Storage (Receipts)"]
        SupaRealtime["Supabase Realtime (Live Sync)"]
    end

    Client -->|HTTP/HTTPS Request| Middleware
    Middleware --> RSC
    Middleware --> RCC
    RCC -->|Invoke| ServerActions
    ServerActions -->|Validate| ZodSchemas
    ZodSchemas -->|Query / Mutate via @supabase/ssr| SupaDB
    RSC -->|Fetch Data with Cookies| SupaDB
    Client -->|Upload / Download Receipts| SupaStorage
    SupaDB --- SupaRLS
    SupaDB --- SupaTriggers
    SupaAuth --- SupaRLS
```

---

## 2. Directory & Application Structure

```text
cashone/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar, Topbar, User profile
│   │   ├── page.tsx                # Main Executive Overview Dashboard
│   │   ├── accounts/page.tsx       # Accounts list & management
│   │   ├── transactions/page.tsx   # Ledger table, filter, export
│   │   ├── categories/page.tsx     # Category & budget limits
│   │   ├── analytics/page.tsx      # Inflow/outflow reports
│   │   └── settings/page.tsx       # Preferences, currencies, backups
│   ├── api/
│   │   └── export/route.ts         # CSV / JSON export
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                         # Base design system (Button, Card, Dialog, Table, Tabs, Badge, Input)
│   ├── dashboard/                  # KPI Metric cards, Cashflow charts, Category breakdown
│   ├── ledger/                     # TransactionFormDialog, TransactionTable
│   ├── accounts/                   # AccountCard, AccountDialog, AccountsHeader
│   ├── categories/                 # CategoryDialog, CategoriesHeader
│   └── layout/                     # Sidebar, Navbar
├── lib/
│   ├── supabase/                   # client.ts, server.ts, middleware.ts
│   ├── actions/                    # accounts.actions.ts, transactions.actions.ts, categories.actions.ts, storage.actions.ts
│   ├── validations/                # account.schema.ts, transaction.schema.ts, category.schema.ts
│   └── utils.ts
├── types/
│   └── database.types.ts
└── doc/
```
