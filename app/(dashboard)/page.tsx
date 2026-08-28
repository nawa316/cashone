import React from "react";
import Link from "next/link";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { getTransactions } from "@/lib/actions/transactions.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Plus,
  PiggyBank,
  PieChart,
  BarChart3,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const [accounts, allTransactions] = await Promise.all([
    getAccounts(),
    getTransactions(),
  ]);

  const recentTransactions = allTransactions.slice(0, 5);

  // Total Net Worth from live accounts
  const totalNetWorth =
    accounts.length > 0
      ? accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0)
      : 32450.0;

  // Filter current month's transactions
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthTransactions = allTransactions.filter((tx) => {
    const txDate = new Date(tx.transaction_date);
    return (
      txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth
    );
  });

  const hasLiveData = allTransactions.length > 0;

  let monthlyInflow = 0;
  let monthlyOutflow = 0;
  const categorySpendingMap = new Map<
    string,
    { name: string; amount: number; color: string }
  >();

  if (hasLiveData) {
    // Use current month transactions, or all transactions if current month is empty
    const activeDataset =
      currentMonthTransactions.length > 0
        ? currentMonthTransactions
        : allTransactions;

    activeDataset.forEach((tx) => {
      const amount = Number(tx.amount || 0);
      const fee = Number(tx.fee || 0);

      if (tx.type === "income") {
        monthlyInflow += amount;
      } else if (tx.type === "expense") {
        const totalExp = amount + fee;
        monthlyOutflow += totalExp;

        const catName = tx.category?.name || "General Expenses";
        const catColor = tx.category?.color_hex || "#EF4444";

        if (!categorySpendingMap.has(catName)) {
          categorySpendingMap.set(catName, {
            name: catName,
            amount: 0,
            color: catColor,
          });
        }
        categorySpendingMap.get(catName)!.amount += totalExp;
      }
    });
  } else {
    // Realistic fallback mock data for empty initial state
    monthlyInflow = 5800.0;
    monthlyOutflow = 2350.0;
  }

  const netMonthlySavings = monthlyInflow - monthlyOutflow;
  const savingsRate =
    monthlyInflow > 0
      ? ((netMonthlySavings / monthlyInflow) * 100).toFixed(1)
      : "0.0";

  // Top category breakdown
  let topExpenseCategories: Array<{
    name: string;
    amount: number;
    percent: number;
    color: string;
  }> = [];

  if (hasLiveData && categorySpendingMap.size > 0) {
    const totalExp = monthlyOutflow || 1;
    topExpenseCategories = Array.from(categorySpendingMap.values())
      .map((c) => ({
        name: c.name,
        amount: c.amount,
        percent: Math.min(Math.round((c.amount / totalExp) * 100), 100),
        color: c.color,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  } else {
    topExpenseCategories = [
      { name: "Housing & Rent", amount: 1200.0, percent: 51, color: "#DC2626" },
      { name: "Food & Dining", amount: 550.0, percent: 23, color: "#EF4444" },
      { name: "Transportation & Fuel", amount: 280.0, percent: 12, color: "#F87171" },
      { name: "Utilities & Internet", amount: 180.0, percent: 8, color: "#FCA5A5" },
      { name: "Subscriptions", amount: 140.0, percent: 6, color: "#FB7185" },
    ];
  }

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-catamaran text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Financial Health Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time multi-account balances, monthly cash flow, and spending analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/analytics">
            <Button size="sm" variant="secondary" className="text-xs">
              <BarChart3 className="w-3.5 h-3.5" />
              Reports
            </Button>
          </Link>
          <Link href="/transactions">
            <Button size="sm" className="text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" />
              Record Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth */}
        <Card className="glass-card hover:border-slate-700 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Net Worth
              </span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-catamaran text-slate-100">
                {formatCurrency(totalNetWorth)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Across {accounts.length > 0 ? accounts.length : 4} active accounts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Inflow (Income) */}
        <Card className="glass-card hover:border-slate-700 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Monthly Income
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-catamaran text-emerald-400">
                +{formatCurrency(monthlyInflow)}
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                {hasLiveData ? "Direct from ledger" : "Salary, freelance & dividends"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Outflow (Expenses) */}
        <Card className="glass-card hover:border-slate-700 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Monthly Expenses
              </span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold font-catamaran text-rose-400">
                -{formatCurrency(monthlyOutflow)}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {monthlyInflow > 0
                  ? `${((monthlyOutflow / monthlyInflow) * 100).toFixed(1)}% of monthly income`
                  : "Recorded expenses"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Net Savings & Rate */}
        <Card className="glass-card hover:border-slate-700 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Net Monthly Savings
              </span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div
                className={`text-2xl font-bold font-catamaran ${
                  netMonthlySavings >= 0 ? "text-blue-400" : "text-rose-400"
                }`}
              >
                {netMonthlySavings >= 0 ? "+" : ""}
                {formatCurrency(netMonthlySavings)}
              </div>
              <p className="text-[11px] text-blue-400 font-medium">
                {savingsRate}% Savings Rate
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Accounts List, Expense Breakdown & Recent Ledger Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accounts & Wallets (1 Col) */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              Accounts & Wallets
            </CardTitle>
            <Link href="/accounts" className="text-xs text-blue-400 hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {(accounts.length > 0
              ? accounts
              : [
                  {
                    id: "1",
                    name: "BCA Main Checking",
                    type: "bank",
                    balance: 12400.0,
                    currency: "USD",
                    color_hex: "#3B82F6",
                  },
                  {
                    id: "2",
                    name: "Emergency Savings",
                    type: "savings",
                    balance: 14500.0,
                    currency: "USD",
                    color_hex: "#10B981",
                  },
                  {
                    id: "3",
                    name: "Digital E-Wallet",
                    type: "e_wallet",
                    balance: 1550.0,
                    currency: "USD",
                    color_hex: "#8B5CF6",
                  },
                  {
                    id: "4",
                    name: "Stock Investment",
                    type: "investment",
                    balance: 4000.0,
                    currency: "USD",
                    color_hex: "#F59E0B",
                  },
                ]
            ).map((acc: any) => (
              <div
                key={acc.id}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {acc.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {acc.type.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="font-catamaran font-bold text-sm text-slate-100">
                  {formatCurrency(acc.balance, acc.currency)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expense Category Breakdown & Recent Ledger (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Expense Breakdown */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PieChart className="w-4 h-4 text-rose-400" />
                Monthly Expense Breakdown
              </CardTitle>
              <Link
                href="/categories"
                className="text-xs text-blue-400 hover:underline"
              >
                Manage Categories
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {topExpenseCategories.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300 flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </span>
                    <span className="font-catamaran font-bold text-slate-200">
                      {formatCurrency(cat.amount)} ({cat.percent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${cat.percent}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Ledger Activity */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                Recent Ledger Activity
              </CardTitle>
              <Link
                href="/transactions"
                className="text-xs text-blue-400 hover:underline"
              >
                Full Ledger
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {(recentTransactions.length > 0
                ? recentTransactions
                : [
                    {
                      id: "1",
                      notes: "Monthly Salary Payout",
                      type: "income",
                      amount: 4500.0,
                      currency: "USD",
                      account: { name: "BCA Main" },
                      transaction_date: new Date().toISOString(),
                    },
                    {
                      id: "2",
                      notes: "Transfer to Savings",
                      type: "transfer",
                      amount: 1000.0,
                      currency: "USD",
                      account: { name: "BCA" },
                      destination_account: { name: "Savings" },
                      transaction_date: new Date().toISOString(),
                    },
                    {
                      id: "3",
                      notes: "Groceries & Supermarket",
                      type: "expense",
                      amount: 165.0,
                      currency: "USD",
                      account: { name: "BCA Main" },
                      transaction_date: new Date().toISOString(),
                    },
                    {
                      id: "4",
                      notes: "Cloud Server Hosting",
                      type: "expense",
                      amount: 45.0,
                      currency: "USD",
                      account: { name: "BCA Main" },
                      transaction_date: new Date().toISOString(),
                    },
                  ]
              ).map((tx: any) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === "income"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : tx.type === "transfer"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : tx.type === "transfer" ? (
                        <ArrowLeftRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">
                        {tx.notes ||
                          (tx.category ? tx.category.name : "Transaction")}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {tx.type === "transfer"
                          ? `${tx.account?.name || "Source"} → ${
                              tx.destination_account?.name || "Destination"
                            }`
                          : tx.account?.name || "Account"}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`font-catamaran font-bold text-sm ${
                      tx.type === "income"
                        ? "text-emerald-400"
                        : tx.type === "transfer"
                        ? "text-blue-400"
                        : "text-rose-400"
                    }`}
                  >
                    {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}
                    {formatCurrency(tx.amount, tx.currency || "USD")}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
