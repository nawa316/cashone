-- ==============================================================================
-- CASHONE PERSONAL FINANCE TRACKER - INITIAL DATABASE SCHEMA MIGRATION
-- Target: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONS & CUSTOM ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Account Classification (Personal Banking & Wallets)
DO $$ BEGIN
    CREATE TYPE account_type AS ENUM (
        'cash',
        'bank',
        'e_wallet',
        'savings',
        'investment',
        'credit_card'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Transaction Flow Types
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM (
        'income',
        'expense',
        'transfer'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Category Types
DO $$ BEGIN
    CREATE TYPE category_type AS ENUM (
        'income',
        'expense'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ==============================================================================
-- 2. TABLES DEFINITIONS
-- ==============================================================================

-- 2.1 Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    default_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    preferences JSONB NOT NULL DEFAULT '{"theme": "dark", "locale": "en-US"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 Financial Accounts & Wallets
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type account_type NOT NULL,
    balance NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    color_hex VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    icon VARCHAR(50) NOT NULL DEFAULT 'wallet',
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Category Tree (Shared System + User Custom)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    type category_type NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'tag',
    color_hex VARCHAR(7) NOT NULL DEFAULT '#10B981',
    is_system BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 Transaction Ledger (Single & Double-Entry)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
    destination_account_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    type transaction_type NOT NULL,
    amount NUMERIC(18, 4) NOT NULL CHECK (amount > 0),
    fee NUMERIC(18, 4) NOT NULL DEFAULT 0.0000 CHECK (fee >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    notes TEXT,
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_transfer_destination CHECK (
        (type = 'transfer' AND destination_account_id IS NOT NULL AND destination_account_id != account_id) OR
        (type != 'transfer' AND destination_account_id IS NULL)
    )
);

-- 2.5 Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    limit_amount NUMERIC(18, 4) NOT NULL CHECK (limit_amount > 0),
    period VARCHAR(20) NOT NULL DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.6 Cross-cutting Tags
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#6B7280',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transaction_tags (
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (transaction_id, tag_id)
);

-- 2.7 Balance Snapshots for Net Worth History
CREATE TABLE IF NOT EXISTS public.balance_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    balance NUMERIC(18, 4) NOT NULL,
    snapshot_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (account_id, snapshot_date)
);

-- ==============================================================================
-- 3. INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON public.transactions(account_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_balance_snapshots_lookup ON public.balance_snapshots(user_id, snapshot_date DESC);

-- ==============================================================================
-- 4. DATABASE TRIGGERS & FUNCTIONS
-- ==============================================================================

-- 4.1 Auto-create Profile on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, default_currency)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'default_currency', 'USD')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4.2 Atomic Double-Entry Balance Sync Trigger
CREATE OR REPLACE FUNCTION public.sync_account_balance_on_transaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Revert previous balances on UPDATE or DELETE
    IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        IF OLD.type = 'income' THEN
            UPDATE public.accounts
            SET balance = balance - OLD.amount, updated_at = now()
            WHERE id = OLD.account_id;
        ELSIF OLD.type = 'expense' THEN
            UPDATE public.accounts
            SET balance = balance + (OLD.amount + OLD.fee), updated_at = now()
            WHERE id = OLD.account_id;
        ELSIF OLD.type = 'transfer' THEN
            UPDATE public.accounts
            SET balance = balance + (OLD.amount + OLD.fee), updated_at = now()
            WHERE id = OLD.account_id;
            UPDATE public.accounts
            SET balance = balance - OLD.amount, updated_at = now()
            WHERE id = OLD.destination_account_id;
        END IF;
    END IF;

    -- Apply new balances on INSERT or UPDATE
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        IF NEW.type = 'income' THEN
            UPDATE public.accounts
            SET balance = balance + NEW.amount, updated_at = now()
            WHERE id = NEW.account_id;
        ELSIF NEW.type = 'expense' THEN
            UPDATE public.accounts
            SET balance = balance - (NEW.amount + NEW.fee), updated_at = now()
            WHERE id = NEW.account_id;
        ELSIF NEW.type = 'transfer' THEN
            UPDATE public.accounts
            SET balance = balance - (NEW.amount + NEW.fee), updated_at = now()
            WHERE id = NEW.account_id;
            UPDATE public.accounts
            SET balance = balance + NEW.amount, updated_at = now()
            WHERE id = NEW.destination_account_id;
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_transaction_balance ON public.transactions;
CREATE TRIGGER trg_sync_transaction_balance
    AFTER INSERT OR UPDATE OR DELETE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_account_balance_on_transaction();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balance_snapshots ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles
CREATE POLICY "Profiles viewable by owner" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles updatable by owner" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5.2 Accounts
CREATE POLICY "Accounts manageable by owner" ON public.accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5.3 Categories
CREATE POLICY "Categories viewable by system or owner" ON public.categories FOR SELECT USING (is_system = true OR auth.uid() = user_id);
CREATE POLICY "Categories insertable by owner" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id AND is_system = false);
CREATE POLICY "Categories updatable by owner" ON public.categories FOR UPDATE USING (auth.uid() = user_id AND is_system = false);
CREATE POLICY "Categories deletable by owner" ON public.categories FOR DELETE USING (auth.uid() = user_id AND is_system = false);

-- 5.4 Transactions
CREATE POLICY "Transactions manageable by owner" ON public.transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5.5 Budgets, Tags, Snapshots
CREATE POLICY "Budgets manageable by owner" ON public.budgets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Tags manageable by owner" ON public.tags FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Snapshots manageable by owner" ON public.balance_snapshots FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 6. SYSTEM SEED DATA (Standard Personal Finance Categories)
-- ==============================================================================
INSERT INTO public.categories (name, type, icon, color_hex, is_system) VALUES
('Salary & Wages', 'income', 'briefcase', '#10B981', true),
('Investments & Dividends', 'income', 'pie-chart', '#34D399', true),
('Freelance & Side Hustle', 'income', 'laptop', '#6EE7B7', true),
('Interest & Cashbacks', 'income', 'coins', '#A7F3D0', true),
('Food & Dining', 'expense', 'utensils', '#EF4444', true),
('Housing & Rent', 'expense', 'home', '#DC2626', true),
('Transportation & Fuel', 'expense', 'car', '#F87171', true),
('Utilities & Internet', 'expense', 'zap', '#FCA5A5', true),
('Entertainment & Leisure', 'expense', 'film', '#F43F5E', true),
('Health & Medical', 'expense', 'heart', '#E11D48', true),
('Shopping & Groceries', 'expense', 'shopping-cart', '#BE123C', true),
('Software & Subscriptions', 'expense', 'server', '#FB7185', true)
ON CONFLICT DO NOTHING;
