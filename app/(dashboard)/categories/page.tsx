import React from "react";
import { getCategories, deleteCategory } from "@/lib/actions/categories.actions";
import { getTransactions } from "@/lib/actions/transactions.actions";
import { getBudgets } from "@/lib/actions/budgets.actions";
import { CategoriesHeader } from "@/components/categories/categories-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, Trash2, Tag, Target, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function CategoriesPage() {
  const [categories, transactions, budgets] = await Promise.all([
    getCategories(),
    getTransactions(),
    getBudgets(),
  ]);

  // Aggregate stats per category
  const categoryStatsMap = new Map<
    string,
    { count: number; totalAmount: number }
  >();

  transactions.forEach((tx) => {
    if (tx.category_id) {
      if (!categoryStatsMap.has(tx.category_id)) {
        categoryStatsMap.set(tx.category_id, { count: 0, totalAmount: 0 });
      }
      const stat = categoryStatsMap.get(tx.category_id)!;
      stat.count += 1;
      stat.totalAmount += Number(tx.amount || 0) + Number(tx.fee || 0);
    }
  });

  // Map category budgets
  const budgetMap = new Map<string, any>();
  budgets.forEach((b) => {
    budgetMap.set(b.category_id, b);
  });

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="space-y-8">
      <CategoriesHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Categories */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              Income Categories
            </CardTitle>
            <Badge variant="profit" className="text-[10px]">
              {incomeCategories.length} Categories
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {incomeCategories.map((cat) => {
              const stat = categoryStatsMap.get(cat.id) || { count: 0, totalAmount: 0 };

              return (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        backgroundColor: `${cat.color_hex}20`,
                        color: cat.color_hex,
                        border: `1px solid ${cat.color_hex}40`,
                      }}
                    >
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">{cat.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{cat.is_system ? "System Category" : "Custom Category"}</span>
                        <span>•</span>
                        <span>{stat.count} transaction{stat.count === 1 ? "" : "s"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-catamaran font-bold text-xs text-emerald-400">
                        +{formatCurrency(stat.totalAmount)}
                      </div>
                      <span className="text-[10px] text-slate-500">All-time inflow</span>
                    </div>

                    {!cat.is_system && (
                      <form
                        action={async () => {
                          "use server";
                          await deleteCategory(cat.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
              Expense Categories
            </CardTitle>
            <Badge variant="loss" className="text-[10px]">
              {expenseCategories.length} Categories
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {expenseCategories.map((cat) => {
              const stat = categoryStatsMap.get(cat.id) || { count: 0, totalAmount: 0 };
              const budget = budgetMap.get(cat.id);

              return (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        backgroundColor: `${cat.color_hex}20`,
                        color: cat.color_hex,
                        border: `1px solid ${cat.color_hex}40`,
                      }}
                    >
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">{cat.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{cat.is_system ? "System Category" : "Custom Category"}</span>
                        <span>•</span>
                        <span>{stat.count} transaction{stat.count === 1 ? "" : "s"}</span>
                        {budget && (
                          <>
                            <span>•</span>
                            <span className="text-blue-400 font-medium flex items-center gap-0.5">
                              <Target className="w-2.5 h-2.5" />
                              Budget: {formatCurrency(budget.amount_limit)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-catamaran font-bold text-xs text-rose-400">
                        -{formatCurrency(stat.totalAmount)}
                      </div>
                      <span className="text-[10px] text-slate-500">All-time outflow</span>
                    </div>

                    {!cat.is_system && (
                      <form
                        action={async () => {
                          "use server";
                          await deleteCategory(cat.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
