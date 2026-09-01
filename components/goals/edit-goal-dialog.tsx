"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateGoal, deleteGoal, type SavingGoal } from "@/lib/actions/goals.actions";
import { type Account } from "@/lib/actions/accounts.actions";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const colorPresets = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4", "#64748B"
];

interface EditGoalDialogProps {
  goal: SavingGoal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
}

export function EditGoalDialog({ goal, open, onOpenChange, accounts }: EditGoalDialogProps) {
  const [selectedColor, setSelectedColor] = useState(goal.color_hex || "#10B981");
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("color_hex", selectedColor);
    formData.append("icon", goal.icon || "target");

    const result = await updateGoal(goal.id, formData);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Unknown error");
    } else {
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    setIsDeleting(true);
    const result = await deleteGoal(goal.id);
    setIsDeleting(false);
    if (!result.success) {
      setError(result.error || "Unknown error");
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>Edit Saving Goal</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update your goal details or change the linked account.
          </DialogDescription>
        </DialogHeader>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Goal Name</label>
            <Input id="name" name="name" defaultValue={goal.name} required className="bg-slate-800 border-slate-700" />
          </div>

          <div className="space-y-2">
            <label htmlFor="account_id" className="text-sm font-medium">Linked Account</label>
            <select
              id="account_id"
              name="account_id"
              defaultValue={goal.account_id}
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
            <Input id="target_amount" name="target_amount" type="number" step="0.01" min="0" defaultValue={goal.target_amount} required className="bg-slate-800 border-slate-700" />
          </div>

          <div className="space-y-2">
            <label htmlFor="target_date" className="text-sm font-medium">Target Date (Optional)</label>
            <Input id="target_date" name="target_date" type="date" defaultValue={goal.target_date ? goal.target_date.split('T')[0] : ''} className="bg-slate-800 border-slate-700" />
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

          <DialogFooter className="pt-4 border-t border-slate-800 flex justify-between w-full">
            <Button type="button" variant="ghost" onClick={handleDelete} disabled={isDeleting} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 mr-auto">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 hover:bg-slate-800">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
