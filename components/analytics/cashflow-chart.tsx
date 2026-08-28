"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { CashflowPoint } from "@/lib/actions/analytics.actions";
import { TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface CashflowChartProps {
  data: CashflowPoint[];
}

export function CashflowChart({ data }: CashflowChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // If no data points, provide empty state
  if (!data || data.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-catamaran font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Cashflow Trajectory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-slate-400 text-xs">
          No transaction history available for the selected timeframe.
        </CardContent>
      </Card>
    );
  }

  // Calculate maximum value for chart scaling
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    100
  );

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-catamaran font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Cashflow Trajectory
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Periodic Inflow vs. Outflow comparison
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-300">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span className="text-slate-300">Expense</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Chart Container */}
          <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-800 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-b border-dashed border-slate-600" />
              <div className="w-full border-b border-dashed border-slate-600" />
              <div className="w-full border-b border-dashed border-slate-600" />
            </div>

            {data.map((point, index) => {
              const incomeHeight = Math.max((point.income / maxVal) * 100, 4);
              const expenseHeight = Math.max((point.expense / maxVal) * 100, 4);
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-16 z-30 bg-slate-900/95 border border-slate-700 rounded-lg p-2.5 shadow-xl backdrop-blur-md text-[11px] whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                      <div className="font-semibold text-slate-200 mb-1">
                        {point.period}
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <ArrowDownLeft className="w-3 h-3" />
                        <span>Income: {formatCurrency(point.income)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-rose-400">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>Expense: {formatCurrency(point.expense)}</span>
                      </div>
                      <div className="border-t border-slate-800 pt-1 mt-1 text-slate-300 font-medium">
                        Net: {point.net >= 0 ? "+" : ""}
                        {formatCurrency(point.net)}
                      </div>
                    </div>
                  )}

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                    {/* Income Bar */}
                    <div
                      className="w-1/2 max-w-[24px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${incomeHeight}%` }}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-1/2 max-w-[24px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${expenseHeight}%` }}
                    />
                  </div>

                  {/* Period Label */}
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-2 truncate w-full text-center group-hover:text-slate-200">
                    {point.period}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Summary Footnote */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block font-medium">
                Average Inflow
              </span>
              <span className="font-catamaran font-bold text-sm text-emerald-400">
                {formatCurrency(
                  data.reduce((sum, d) => sum + d.income, 0) / data.length
                )}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block font-medium">
                Average Outflow
              </span>
              <span className="font-catamaran font-bold text-sm text-rose-400">
                {formatCurrency(
                  data.reduce((sum, d) => sum + d.expense, 0) / data.length
                )}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block font-medium">
                Net Period Accumulation
              </span>
              <span className="font-catamaran font-bold text-sm text-blue-400">
                {formatCurrency(
                  data.reduce((sum, d) => sum + d.net, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
