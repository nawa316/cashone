"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRecurringTemplate } from "@/lib/actions/recurring.actions";
import { Repeat, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";

interface RecurringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: any[];
  categories: any[];
}

export function RecurringDialog({
  open,
  onOpenChange,
  accounts = [],
  categories = [],
}: RecurringDialogProps) {
  const [type, setType] = useState<"expense" | "income" | "transfer">("expense");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("type", type);
    formData.set("frequency", frequency);

    const result = await createRecurringTemplate(formData);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to create recurring plan");
    } else {
      onOpenChange(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-catamaran text-lg text-slate-100">
            <Repeat className="w-5 h-5 text-blue-400" />
            Set Up Recurring Schedule
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Type Segment Control */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                type === "expense"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                type === "income"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Income
            </button>
            <button
              type="button"
              onClick={() => setType("transfer")}
              className={`py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                type === "transfer"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Transfer
            </button>
          </div>

          {/* Plan Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Schedule / Plan Name
            </label>
            <Input
              name="name"
              placeholder="e.g. Netflix Subscription, Apartment Rent, Monthly Salary"
              required
            />
          </div>

          {/* Amount & Frequency Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Amount</label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="daily" className="bg-slate-900">Daily</option>
                <option value="weekly" className="bg-slate-900">Weekly</option>
                <option value="monthly" className="bg-slate-900">Monthly</option>
                <option value="yearly" className="bg-slate-900">Yearly</option>
              </select>
            </div>
          </div>

          {/* Account Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {type === "transfer" ? "Source Account" : "Account"}
            </label>
            <select
              name="account_id"
              required
              className="w-full h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-slate-900">
                  {acc.name} ({acc.currency})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Account (if transfer) */}
          {type === "transfer" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Destination Account
              </label>
              <select
                name="destination_account_id"
                required
                className="w-full h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Destination</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-slate-900">
                    {acc.name} ({acc.currency})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category (if expense or income) */}
          {type !== "transfer" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                name="category_id"
                className="w-full h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Category (Optional)</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">First / Effective Date</label>
            <Input
              name="start_date"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
