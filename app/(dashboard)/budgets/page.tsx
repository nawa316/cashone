import React from "react";
import { getBudgets } from "@/lib/actions/budgets.actions";
import { getCategories } from "@/lib/actions/categories.actions";
import { getUserProfile } from "@/lib/actions/profile.actions";
import { BudgetsHeader } from "@/components/budgets/budgets-header";
import { BudgetCard } from "@/components/budgets/budget-card";
import { Card, CardContent } from "@/components/ui/card";
import { PiggyBank, ArrowDownLeft, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function BudgetsPage() {
  const [budgets, categories, profile] = await Promise.all([
    getBudgets(),
    getCategories("expense"),
    getUserProfile(),
  ]);

  const userCurrency = profile?.default_currency || "USD";

  const totalBudgetPool = budgets.reduce(
    (sum, b) => sum + Number(b.limit_amount || 0),
    0
  );
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
  const totalRemaining = Math.max(totalBudgetPool - totalSpent, 0);
  const totalOverBudgetCount = budgets.filter((b) => b.isOverBudget).length;

  return (
    <div className="space-y-8">
      {/* Header & CTA */}
      <BudgetsHeader categories={categories} />

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budgeted Pool */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Total Monthly Budget
              </span>
              <span className="font-catamaran font-bold text-xl text-slate-100">
                {formatCurrency(totalBudgetPool, userCurrency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
              <PiggyBank className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Total Spent in Period
              </span>
              <span className="font-catamaran font-bold text-xl text-rose-400">
                {formatCurrency(totalSpent, userCurrency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Remaining Allowance & Alert Indicator */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Remaining Allowance
              </span>
              <span className="font-catamaran font-bold text-xl text-emerald-400">
                {formatCurrency(totalRemaining, userCurrency)}
              </span>
            </div>
            <div
              className={`p-2.5 rounded-xl ${
                totalOverBudgetCount > 0
                  ? "bg-rose-500/15 text-rose-400"
                  : "bg-emerald-500/15 text-emerald-400"
              }`}
            >
              {totalOverBudgetCount > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <PiggyBank className="w-5 h-5" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Budgets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-catamaran text-lg font-bold text-slate-100">
            Active Category Budgets
          </h2>
          <span className="text-xs font-catamaran font-semibold text-slate-400">
            {budgets.length} Budgets Active
          </span>
        </div>

        {budgets.length === 0 ? (
          <Card className="glass-card border-dashed border-slate-800">
            <CardContent className="p-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">No category budgets established</p>
              <p className="text-xs text-slate-500">
                Click &quot;Set Budget Limit&quot; above to establish spending limits for categories like Food, Housing, or Subscriptions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
