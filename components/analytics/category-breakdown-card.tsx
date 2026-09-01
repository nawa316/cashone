"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { CategoryBreakdownItem } from "@/lib/actions/analytics.actions";
import { PieChart, Tag } from "lucide-react";

interface CategoryBreakdownCardProps {
  currency?: string;
  categories: CategoryBreakdownItem[];
  totalExpense: number;
}

export function CategoryBreakdownCard({
  categories,
  totalExpense,
  currency = 'USD',
}: CategoryBreakdownCardProps) {
  if (!categories || categories.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-catamaran font-bold text-slate-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-400" />
            Category Spending Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-slate-400 text-xs">
          No category expense data recorded for this timeframe.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-catamaran font-bold text-slate-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-400" />
            Category Spending Distribution
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown of expenses by allocated categories
          </p>
        </div>
        <span className="text-xs font-semibold text-rose-400 font-catamaran">
          Total: {formatCurrency(totalExpense, currency)}
        </span>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Multi-segment Colored Ratio Bar */}
        <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden p-0.5 gap-0.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="h-full rounded-xs transition-all duration-300 hover:opacity-80"
              style={{
                width: `${Math.max(cat.percentage, 2)}%`,
                backgroundColor: cat.color || "#3B82F6",
              }}
              title={`${cat.name}: ${cat.percentage}%`}
            />
          ))}
        </div>

        {/* Category List with Proportional Meters */}
        <div className="space-y-3 pt-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color || "#3B82F6" }}
                  />
                  <span className="font-medium text-slate-200">{cat.name}</span>
                  <span className="text-[10px] text-slate-500">
                    ({cat.transactionCount} tx)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 font-catamaran">
                    {formatCurrency(cat.totalAmount, currency)}
                  </span>
                  <span className="font-semibold text-[11px] text-slate-400 w-8 text-right font-catamaran">
                    {cat.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color || "#3B82F6",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
