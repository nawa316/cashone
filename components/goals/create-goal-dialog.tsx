"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGoal } from "@/lib/actions/goals.actions";
import { type Account } from "@/lib/actions/accounts.actions";
import { cn } from "@/lib/utils";

const colorPresets = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4", "#64748B"
];

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
}

export function CreateGoalDialog({ open, onOpenChange, accounts }: CreateGoalDialogProps) {
  const [selectedColor, setSelectedColor] = useState("#10B981");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("color_hex", selectedColor);

    const result = await createGoal(formData);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "An unknown error occurred");
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>Create Saving Goal</DialogTitle>
          <DialogDescription className="text-slate-400">
            Link a saving goal to an account to track its progress.
          </DialogDescription>
        </DialogHeader>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Goal Name</label>
            <Input id="name" name="name" placeholder="e.g. Vacation Fund" required className="bg-slate-800 border-slate-700" />
          </div>

          <div className="space-y-2">
            <label htmlFor="account_id" className="text-sm font-medium">Linked Account</label>
            <select
              id="account_id"
              name="account_id"
              required
              className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-100"
            >
              <option value="">Select an account...</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="target_amount" className="text-sm font-medium">Target Amount</label>
            <Input id="target_amount" name="target_amount" type="number" step="0.01" min="0" placeholder="0.00" required className="bg-slate-800 border-slate-700" />
          </div>

          <div className="space-y-2">
            <label htmlFor="target_date" className="text-sm font-medium">Target Date (Optional)</label>
            <Input id="target_date" name="target_date" type="date" className="bg-slate-800 border-slate-700" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-200",
                    selectedColor === color ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-110"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 hover:bg-slate-800">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
