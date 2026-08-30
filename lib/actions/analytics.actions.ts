"use server";

import { createClient } from "@/lib/supabase/server";
import { getAccounts } from "@/lib/actions/accounts.actions";

export interface CashflowPoint {
  period: string; // e.g. "Jan", "Feb", or "2026-08-01"
  income: number;
  expense: number;
  net: number;
}

export interface DailyTrendPoint {
  date: string; // "YYYY-MM-DD"
  dayLabel: string; // e.g. "Mon 24"
  shortDay: string; // e.g. "Mon"
  fullDate: string; // e.g. "Mon, Aug 24, 2026"
  income: number;
  expense: number;
  transfer: number;
  net: number;
}

export function getWeeklyTrendData(
  transactions: {
    transaction_date: string;
    type: string;
    amount: number | string;
    fee?: number | string | null;
  }[]
): DailyTrendPoint[] {
  const result: DailyTrendPoint[] = [];
  const now = new Date();

  // Generate 7 days from 6 days ago up to today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const shortDay = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayLabel = `${shortDay} ${d.getDate()}`;
    const fullDate = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    result.push({
      date: dateKey,
      dayLabel,
      shortDay,
      fullDate,
      income: 0,
      expense: 0,
      transfer: 0,
      net: 0,
    });
  }

  // Aggregate transactions by date
  transactions.forEach((tx) => {
    if (!tx.transaction_date) return;
    const txDate = new Date(tx.transaction_date);
    if (isNaN(txDate.getTime())) return;

    const year = txDate.getFullYear();
    const month = String(txDate.getMonth() + 1).padStart(2, "0");
    const day = String(txDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const targetDay = result.find((d) => d.date === dateKey);
    if (!targetDay) return;

    const amount = Number(tx.amount || 0);
    const fee = Number(tx.fee || 0);

    if (tx.type === "income") {
      targetDay.income += amount;
      targetDay.net += amount;
    } else if (tx.type === "expense") {
      const totalExp = amount + fee;
      targetDay.expense += totalExp;
      targetDay.net -= totalExp;
    } else if (tx.type === "transfer") {
      targetDay.transfer += amount;
    }
  });

  return result;
}

export interface CategoryBreakdownItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

export interface AssetAllocationItem {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
  percentage: number;
}

export interface AnalyticsSummary {
  timeframe: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  transactionCount: number;
  cashflowTrend: CashflowPoint[];
  categoryBreakdown: CategoryBreakdownItem[];
  assetAllocation: AssetAllocationItem[];
  largestExpense?: {
    name: string;
    amount: number;
    category: string;
    date: string;
  } | null;
}

export async function getAnalyticsData(
  timeframe: "7d" | "30d" | "3m" | "6m" | "12m" | "all" = "30d"
): Promise<AnalyticsSummary> {
  const supabase = await createClient();

  // Calculate start date based on timeframe
  const now = new Date();
  let startDate: Date | null = new Date();

  if (timeframe === "7d") {
    startDate.setDate(now.getDate() - 7);
  } else if (timeframe === "30d") {
    startDate.setDate(now.getDate() - 30);
  } else if (timeframe === "3m") {
    startDate.setMonth(now.getMonth() - 3);
  } else if (timeframe === "6m") {
    startDate.setMonth(now.getMonth() - 6);
  } else if (timeframe === "12m") {
    startDate.setFullYear(now.getFullYear() - 1);
  } else {
    startDate = null; // all time
  }

  // Fetch transactions with category and account details
  let query = supabase
    .from("transactions")
    .select(`
      id,
      type,
      amount,
      fee,
      transaction_date,
      notes,
      category:categories(id, name, type, icon, color_hex),
      account:accounts!transactions_account_id_fkey(id, name, type, color_hex)
    `)
    .order("transaction_date", { ascending: true });

  if (startDate) {
    query = query.gte("transaction_date", startDate.toISOString());
  }

  const [{ data: transactions, error }, accounts] = await Promise.all([
    query,
    getAccounts(),
  ]);

  if (error) {
    console.error("Error fetching transactions for analytics:", error);
  }

  const txList = (transactions as any[]) || [];

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap = new Map<
    string,
    {
      id: string;
      name: string;
      icon: string;
      color: string;
      total: number;
      count: number;
    }
  >();

  let largestExpenseItem: {
    name: string;
    amount: number;
    category: string;
    date: string;
  } | null = null;

  // Aggregate cashflow by month/period bucket
  const periodMap = new Map<string, { income: number; expense: number }>();

  txList.forEach((tx) => {
    const amount = Number(tx.amount || 0);
    const fee = Number(tx.fee || 0);
    const date = new Date(tx.transaction_date);

    // Format bucket key (e.g. "MMM dd" for 7d/30d or "MMM yyyy" for 3m+)
    let periodKey: string;
    if (timeframe === "7d" || timeframe === "30d") {
      periodKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      periodKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    }

    if (!periodMap.has(periodKey)) {
      periodMap.set(periodKey, { income: 0, expense: 0 });
    }
    const currentPeriod = periodMap.get(periodKey)!;

    if (tx.type === "income") {
      totalIncome += amount;
      currentPeriod.income += amount;
    } else if (tx.type === "expense") {
      const expenseAmount = amount + fee;
      totalExpense += expenseAmount;
      currentPeriod.expense += expenseAmount;

      if (
        !largestExpenseItem ||
        expenseAmount > largestExpenseItem.amount
      ) {
        largestExpenseItem = {
          name: tx.notes || tx.category?.name || "Expense",
          amount: expenseAmount,
          category: tx.category?.name || "Uncategorized",
          date: tx.transaction_date,
        };
      }

      // Track category breakdown
      const catId = tx.category?.id || "uncategorized";
      const catName = tx.category?.name || "Uncategorized";
      const catIcon = tx.category?.icon || "tag";
      const catColor = tx.category?.color_hex || "#64748B";

      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, {
          id: catId,
          name: catName,
          icon: catIcon,
          color: catColor,
          total: 0,
          count: 0,
        });
      }

      const catRecord = categoryMap.get(catId)!;
      catRecord.total += expenseAmount;
      catRecord.count += 1;
    }
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Build cashflowTrend array
  const cashflowTrend: CashflowPoint[] = Array.from(
    periodMap.entries()
  ).map(([period, data]) => ({
    period,
    income: data.income,
    expense: data.expense,
    net: data.income - data.expense,
  }));

  // Build categoryBreakdown array sorted by amount descending
  const categoryBreakdown: CategoryBreakdownItem[] = Array.from(
    categoryMap.values()
  )
    .map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      totalAmount: c.total,
      percentage:
        totalExpense > 0 ? Math.round((c.total / totalExpense) * 100) : 0,
      transactionCount: c.count,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  // Build assetAllocation from accounts
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Math.max(Number(acc.balance || 0), 0),
    0
  );

  const assetAllocation: AssetAllocationItem[] = accounts.map((acc) => {
    const bal = Number(acc.balance || 0);
    return {
      id: acc.id,
      name: acc.name,
      type: acc.type,
      balance: bal,
      color: acc.color_hex || "#3B82F6",
      percentage:
        totalBalance > 0 ? Math.round((Math.max(bal, 0) / totalBalance) * 100) : 0,
    };
  });

  return {
    timeframe,
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    transactionCount: txList.length,
    cashflowTrend,
    categoryBreakdown,
    assetAllocation,
    largestExpense: largestExpenseItem,
  };
}
