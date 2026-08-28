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
import { createCategory } from "@/lib/actions/categories.actions";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorPresets = [
  "#10B981", // Emerald
  "#EF4444", // Rose
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedColor, setSelectedColor] = useState("#10B981");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("type", type);
    formData.set("color_hex", selectedColor);

    try {
      const res = await createCategory(formData);
      if (res.success) {
        onOpenChange(false);
      } else {
        setError(res.error || "Failed to create category");
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
          <DialogTitle>Add Custom Category</DialogTitle>
          <DialogDescription>
            Create user-defined tags for classifying cash flows and expenses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Category Name</label>
            <Input
              name="name"
              placeholder="e.g. Subscriptions, Crypto Staking, Coffee..."
              required
              className="bg-slate-900 border-slate-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Category Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                  type === "expense"
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                Expense Category
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                  type === "income"
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                Income Category
              </button>
            </div>
          </div>

          {/* Color Preset */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Accent Color</label>
            <div className="flex items-center gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    selectedColor === color
                      ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900"
                      : "opacity-75 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
