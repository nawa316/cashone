# UI/UX Design System & Layout Specification
## Cashone — Personal Finance & Cashflow Tracker

**Aesthetic Direction:** Dark-mode first, High-density Financial Terminal with Glassmorphism Accents  
**Typography:** Catamaran (Display/Headers & Numeric Tables) + Inter (Body & UI)  
**Iconography:** `lucide-react`  
**Styling Framework:** Tailwind CSS v4  
**Document Version:** 2.0.0  

---

## 1. Design Tokens & Color Palette

```css
:root {
  /* Surface & Background */
  --bg-primary: #0b0f19;       /* Main canvas background */
  --bg-secondary: #111827;     /* Card & modal containers */
  --bg-tertiary: #1f2937;      /* Hover states, borders */

  /* Borders & Dividers */
  --border-subtle: #1e293b;
  --border-focus: #3b82f6;

  /* Typography Colors */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Financial Status Semantic Accents */
  --color-profit: #10b981;     /* Emerald 500: Inflow, Income, Savings */
  --color-loss: #ef4444;       /* Rose 500: Outflow, Expenses */
  --color-transfer: #3b82f6;   /* Blue 500: Inter-account transfers */
  --color-warning: #f59e0b;    /* Amber 500: Budget limits */
}
```

---

## 2. Core UI Components & Patterns

### 2.1. Metric KPI Card
Used for Net Worth, Monthly Income, Monthly Expenses, and Net Savings Rate %.
* **Layout:** Top row (Icon badge), Middle row (Metric value with currency symbol), Bottom row (Comparison / breakdown subtitle).

### 2.2. Transaction Ledger Table
* **Sticky Header:** Multi-column sorting (Date, Type, Account / Route, Category / Memo, Amount, Receipt, Actions).
* **Type Badges:**
  * `Income`: Green badge with `ArrowDownLeft` icon.
  * `Expense`: Red badge with `ArrowUpRight` icon.
  * `Transfer`: Blue badge with `ArrowLeftRight` icon showing `[Source Account] → [Destination Account]`.
* **Receipt Preview:** In-app lightbox image preview.

---

## 3. Screen Layout Specifications

### 3.1. Main Executive Dashboard Layout (`/`)

```text
+-----------------------------------------------------------------------------------------------+
| Cashone Logo      [Search Transactions...]                      [+ Add Transaction]  [Profile]|
+-----------------------------------------------------------------------------------------------+
| [Dashboard]  [Accounts & Wallets]  [Transactions]  [Analytics & Reports]  [Categories]  [Set] |
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
|  [ TOTAL NET WORTH ]      [ MONTHLY INCOME ]      [ MONTHLY EXPENSES ]     [ NET SAVINGS ]    |
|     $32,450.00               +$5,800.00                -$2,350.00              +$3,450.00     |
|     (4 active accounts)      (Salary & Freelance)      (40.5% of income)       (59.5% Rate)   |
|                                                                                               |
|  +--------------------------------------------+  +-----------------------------------------+  |
|  |  Accounts & Wallets                        |  |  Category Expense Breakdown             |  |
|  |  • BCA Main Checking       $12,400.00      |  |  • Housing & Rent     $1,200.00 (51%)   |  |
|  |  • Emergency Savings       $14,500.00      |  |  • Food & Dining        $550.00 (23%)   |  |
|  |  • Digital E-Wallet         $1,550.00      |  |  • Transportation       $280.00 (12%)   |  |
|  |  • Stock Investment         $4,000.00      |  |  • Utilities            $180.00 (8%)    |  |
|  +--------------------------------------------+  +-----------------------------------------+  |
|                                                                                               |
|  +-----------------------------------------------------------------------------------------+  |
|  |  Recent Ledger Transactions (Latest)                                                    |  |
|  |  • Salary Deposit       +$4,500.00 (BCA Main)                                          |  |
|  |  • Transfer to Savings   $1,000.00 (BCA → Savings)                                      |  |
|  |  • Groceries & Food       -$165.00 (BCA Main)                                           |  |
|  +-----------------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------------+
```
