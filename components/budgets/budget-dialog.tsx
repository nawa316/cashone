"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBudget, updateBudget } from "@/lib/actions/budgets.actions";

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  initialData?: any;
}

export function BudgetDialog({
  open,
  onOpenChange,
  categories = [],
  initialData,
}: BudgetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = categories.filter((c) => c.type === "expense");

  // Default to current calendar month
  const now = new Date();
  const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (initialData?.id) {
        res = await updateBudget(initialData.id, formData);
      } else {
        res = await createBudget(formData);
      }

      if (res.success) {
        onOpenChange(false);
      } else {
        setError(res.error || "Failed to save budget");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Budget Limit" : "Set Monthly Budget"}
          </DialogTitle>
          <DialogDescription>
            Establish monthly spending limits per category with threshold notifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
              {error}
            </div>
          )}

          {!initialData && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Expense Category
              </label>
              <select
                name="category_id"
                required
                defaultValue={expenseCategories[0]?.id || ""}
                className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Spending Limit ($)
            </label>
            <Input
              name="limit_amount"
              type="number"
              step="0.01"
              min="1"
              placeholder="e.g. 500.00"
              defaultValue={initialData?.limit_amount || ""}
              required
              className="bg-slate-900 border-slate-700 font-catamaran text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Start Date</label>
              <Input
                name="start_date"
                type="date"
                defaultValue={initialData?.start_date || defaultStartDate}
                required
                className="bg-slate-900 border-slate-700 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">End Date</label>
              <Input
                name="end_date"
                type="date"
                defaultValue={initialData?.end_date || defaultEndDate}
                required
                className="bg-slate-900 border-slate-700 text-xs"
              />
            </div>
          </div>

          <input type="hidden" name="period" value="monthly" />

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Budget" : "Create Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
