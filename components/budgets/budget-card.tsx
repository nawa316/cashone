"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteBudget } from "@/lib/actions/budgets.actions";
import { Tag, AlertTriangle, CheckCircle2, Trash2, Edit2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BudgetCardProps {
  currency?: string;
  budget: {
    id: string;
    limit_amount: number;
    period: string;
    start_date: string;
    end_date: string;
    category?: {
      id: string;
      name: string;
      icon: string;
      color_hex: string;
    } | null;
    spent?: number;
    percentage?: number;
    remaining?: number;
    isOverBudget?: boolean;
  };
  onEdit?: (budget: any) => void;
}

export function BudgetCard({ budget, onEdit, currency = "USD" }: BudgetCardProps) {
  const spent = budget.spent || 0;
  const limit = Number(budget.limit_amount) || 1;
  const percentage = budget.percentage || 0;
  const isOver = budget.isOverBudget;
  const isWarning = percentage >= 75 && !isOver;

  // Threshold colors
  const statusColor = isOver
    ? "#EF4444" // Rose
    : isWarning
    ? "#F59E0B" // Amber
    : "#10B981"; // Emerald

  return (
    <Card className="glass-card hover:border-slate-700 transition-all group relative overflow-hidden">
      {/* Top Accent Line */}
      <div
        className="h-1 w-full absolute top-0 left-0"
        style={{ backgroundColor: statusColor }}
      />

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{
                backgroundColor: `${budget.category?.color_hex || statusColor}20`,
                color: budget.category?.color_hex || statusColor,
                border: `1px solid ${budget.category?.color_hex || statusColor}40`,
              }}
            >
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-catamaran text-lg font-bold text-slate-100">
                {budget.category?.name || "Budget"}
              </h3>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                {budget.period} • {budget.start_date} to {budget.end_date}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              variant={isOver ? "loss" : isWarning ? "warning" : "profit"}
              className="text-[10px]"
            >
              {isOver ? (
                <>
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  OVER BUDGET
                </>
              ) : isWarning ? (
                <>
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  NEAR LIMIT ({percentage}%)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  ON TRACK ({percentage}%)
                </>
              )}
            </Badge>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              {onEdit && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-slate-400 hover:text-white"
                  onClick={() => onEdit(budget)}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              )}
              <form
                action={async () => {
                  if (confirm("Delete this budget limit?")) {
                    await deleteBudget(budget.id);
                  }
                }}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  type="submit"
                  className="h-7 w-7 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Numbers Comparison */}
        <div className="mt-5 space-y-2">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-slate-400">
              Spent:{" "}
              <strong className="font-catamaran font-bold text-slate-200 text-sm">
                {formatCurrency(spent, currency)}
              </strong>
            </span>
            <span className="text-slate-400">
              Limit:{" "}
              <strong className="font-catamaran font-bold text-slate-200 text-sm">
                {formatCurrency(limit, currency)}
              </strong>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>

          {/* Remaining Allowance */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
            <span>
              {isOver
                ? `Exceeded by ${formatCurrency(spent - limit, currency)}`
                : `${formatCurrency(budget.remaining || 0, currency)} remaining`}
            </span>
            <span className="font-catamaran font-semibold" style={{ color: statusColor }}>
              {percentage}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
