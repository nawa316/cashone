# Product Requirements Document (PRD)
## Project Name: Cashone Personal Finance & Cashflow Tracker

### 1. Overview
Cashone is a high-performance personal finance tracking web application designed to manage multi-account cash flows (income, expenses, inter-account transfers) with atomic double-entry ledger balance integrity, category analytics, and receipt storage.

### 2. Objectives & Goals
*   **Unified Multi-Account Tracking:** Manage checking accounts, high-yield savings, digital e-wallets, cash, and investments in one cohesive dashboard.
*   **Accurate Transfer Handling:** Seamlessly manage funds moving between banks and e-wallets without treating them as false income or expenses.
*   **Actionable Cashflow Analytics:** Provide clear insights into monthly income vs. expenses, category distributions, savings rate, and net worth trajectory.
*   **Data Sovereignty & Privacy:** Zero-trust user isolation enforced at the database level with Row Level Security (RLS).

### 3. Tech Stack & Fullstack Architecture
*   **Fullstack Framework:** Next.js 16 (App Router) — unifying frontend (React 19 Server & Client Components) and backend (Server Actions, Route Handlers, Edge Middleware) in a single TypeScript codebase.
*   **Database & BaaS:** Supabase (Managed PostgreSQL 15+, Supabase Auth, Row Level Security, Storage).
*   **UI/UX Design:** 
    *   Typography: Catamaran font for high-legibility tabular financial numbers & data tables + Inter for UI.
    *   Iconography: `lucide-react` for crisp UI icons.
    *   Styling: Tailwind CSS v4 with dark terminal theme tokens and glassmorphism.
*   **Deployment Target:** Vercel (Production Edge/Serverless CI/CD).

### 4. Core Features

#### 4.1. Account Management
*   Support for multiple account types (Bank Checking, Savings, E-Wallets, Cash, Investments, Credit Cards).
*   Custom color tokens and balance visibility.

#### 4.2. Transaction Ledger
*   **Income & Expenses:** Single-entry categorized logging with receipt attachments.
*   **Transfers:** Double-entry logic linking a source account and a destination account within a single transaction record to ensure balances remain atomically synced.

#### 4.3. Analytics Dashboard
*   Monthly cash flow summaries (Income vs. Expense).
*   Net Monthly Savings amount and Savings Rate %.
*   Category expense distributions and spending breakdowns.
*   Consolidated total net worth across all liquid holdings.

### 5. Database Schema Blueprint
```sql
-- Accounts
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type ENUM('cash', 'bank', 'e_wallet', 'savings', 'investment', 'credit_card'),
    balance NUMERIC(18, 4) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    color_hex VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'wallet',
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type ENUM('income', 'expense'),
    icon VARCHAR(50) DEFAULT 'tag',
    color_hex VARCHAR(7) DEFAULT '#10B981',
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ledger Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id),
    destination_account_id UUID REFERENCES accounts(id) NULL,
    category_id UUID REFERENCES categories(id) NULL,
    type ENUM('income', 'expense', 'transfer'),
    amount NUMERIC(18, 4) NOT NULL,
    fee NUMERIC(18, 4) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_date TIMESTAMPTZ DEFAULT now(),
    notes TEXT,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 6. Development Phases
*   **Phase 1: Foundation & Auth (Fullstack Next.js + Supabase)**
    *   Setup Supabase migrations, triggers, RLS policies, and `@supabase/ssr`.
    *   Implement Next.js Edge Middleware for protected routes and session refresh.
    *   Build base dashboard layout with Catamaran font and Dark Mode tokens.
*   **Phase 2: Accounts & Transaction Ledger**
    *   Build Account CRUD and Multi-Account views.
    *   Implement double-entry transfer engine via Server Actions and Supabase triggers.
    *   Integrate receipt upload to Supabase Storage.
*   **Phase 3: Category & Budget Limits**
    *   Build hierarchical category management.
    *   Implement monthly budget limits by category with alert thresholds.
*   **Phase 4: Analytics Dashboard & Vercel Deployment**
    *   Construct analytical charts (Monthly Cashflows, Net Worth curve, Category Expense Distribution).
    *   Configure Vercel CI/CD pipeline and production environment.
