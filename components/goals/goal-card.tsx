"use client";

import React from "react";
import { type SavingGoal } from "@/lib/actions/goals.actions";
import { Target, Edit2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface GoalCardProps {
  goal: SavingGoal;
  currentBalance: number;
  currency: string;
  onEdit: () => void;
}

export function GoalCard({ goal, currentBalance, currency, onEdit }: GoalCardProps) {
  const percentage = Math.min(100, Math.max(0, (currentBalance / goal.target_amount) * 100));
  const isCompleted = currentBalance >= goal.target_amount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="text-slate-400 hover:text-white p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800"
          style={{ color: goal.color_hex }}
        >
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-slate-200">{goal.name}</h3>
          <p className="text-xs text-slate-500">
            Target: {formatCurrency(goal.target_amount, currency)}
          </p>
        </div>
      </div>

      <div className="mb-2 flex justify-between items-end">
        <div>
          <span className="text-2xl font-semibold text-white">
            {formatCurrency(currentBalance, currency)}
          </span>
        </div>
        <div className="text-sm font-medium text-slate-400">
          {percentage.toFixed(1)}%
        </div>
      </div>

      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
        <div
          className={cn("h-full rounded-full transition-all duration-500", isCompleted ? "bg-green-500" : "bg-blue-500")}
          style={{ width: `${percentage}%`, backgroundColor: !isCompleted ? goal.color_hex : undefined }}
        />
      </div>

      {goal.target_date && (
        <div className="mt-4 text-xs text-slate-500 flex justify-between">
          <span>Target Date</span>
          <span>{new Date(goal.target_date).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}
