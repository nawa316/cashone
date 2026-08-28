# API & Data Access Layer Specification
## Cashone — Personal Finance Server Actions & API Contract

This document specifies the Data Access Layer (DAL), Next.js Server Actions, Zod validation schemas, and error response formats.

---

## 1. Validation Schemas (Zod)

### 1.1. Account Schema (`lib/validations/account.schema.ts`)
```typescript
import { z } from 'zod';

export const AccountTypeEnum = z.enum([
  'cash',
  'bank',
  'e_wallet',
  'savings',
  'investment',
  'credit_card'
]);

export const CreateAccountSchema = z.object({
  name: z.string().min(2, 'Account name must be at least 2 characters').max(100),
  type: AccountTypeEnum,
  balance: z.number().default(0),
  currency: z.string().length(3).default('USD'),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6'),
  icon: z.string().default('wallet')
});
```

### 1.2. Transaction & Transfer Schema (`lib/validations/transaction.schema.ts`)
```typescript
import { z } from 'zod';

export const TransactionTypeEnum = z.enum(['income', 'expense', 'transfer']);

export const TransactionFormSchema = z.object({
  account_id: z.string().uuid('Invalid source account'),
  destination_account_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  type: TransactionTypeEnum,
  amount: z.number().positive('Amount must be greater than zero'),
  fee: z.number().nonnegative('Fee cannot be negative').default(0),
  currency: z.string().length(3).default('USD'),
  transaction_date: z.string().datetime().or(z.date()),
  notes: z.string().max(500).optional().nullable(),
  receipt_url: z.string().url().optional().nullable(),
}).refine((data) => {
  if (data.type === 'transfer') {
    return !!data.destination_account_id && data.destination_account_id !== data.account_id;
  }
  return true;
}, {
  message: 'Transfers require a distinct destination account',
  path: ['destination_account_id']
});
```

---

## 2. Server Actions Contract

### 2.1. Account Actions (`lib/actions/accounts.actions.ts`)
* `getAccounts(): Promise<Account[]>`
* `createAccount(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }>`
* `updateAccount(id: string, formData: FormData): Promise<{ success: boolean; error?: string }>`
* `deleteAccount(id: string): Promise<{ success: boolean; error?: string }>`

### 2.2. Transaction Actions (`lib/actions/transactions.actions.ts`)
* `getTransactions(options?: { accountId?: string; type?: string; limit?: number }): Promise<Transaction[]>`
* `createTransaction(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }>`
* `deleteTransaction(id: string): Promise<{ success: boolean; error?: string }>`

### 2.3. Category Actions (`lib/actions/categories.actions.ts`)
* `getCategories(type?: 'income' | 'expense'): Promise<Category[]>`
* `createCategory(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }>`
* `deleteCategory(id: string): Promise<{ success: boolean; error?: string }>`
