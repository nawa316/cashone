"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAccount, updateAccount } from "@/lib/actions/accounts.actions";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

const colorPresets = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#64748B", // Slate
];

export function AccountDialog({
  open,
  onOpenChange,
  initialData,
}: AccountDialogProps) {
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color_hex || "#3B82F6"
  );
  const [selectedType, setSelectedType] = useState(
    initialData?.type || "bank"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("color_hex", selectedColor);

    try {
      let result;
      if (initialData?.id) {
        result = await updateAccount(initialData.id, formData);
      } else {
        result = await createAccount(formData);
      }

      if (result.success) {
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to save account");
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
            {initialData ? "Edit Account" : "Add Financial Account"}
          </DialogTitle>
          <DialogDescription>
            Configure your bank checking, savings, physical cash, or investment wallet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Account Name
            </label>
            <Input
              name="name"
              placeholder="e.g. BCA Main Checking, Emergency Savings"
              defaultValue={initialData?.name || ""}
              required
              className="bg-slate-900 border-slate-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Account Type
            </label>
            <select
              name="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="bank">Bank Checking</option>
              <option value="savings">High-Yield Savings / Emergency Fund</option>
              <option value="e_wallet">E-Wallet (GoPay, OVO, PayPal, Apple Pay)</option>
              <option value="cash">Physical Cash Wallet</option>
              <option value="investment">Investment & Mutual Funds</option>
              <option value="credit_card">Credit Card Account</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Initial Balance
              </label>
              <Input
                name="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue={initialData?.balance || "0"}
                disabled={!!initialData}
                className="bg-slate-900 border-slate-700 font-catamaran"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Currency
              </label>
              <select
                name="currency"
                defaultValue={initialData?.currency || "USD"}
                className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              >
                <option value="USD">USD ($)</option>
                <option value="IDR">IDR (Rp)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="SGD">SGD ($)</option>
              </select>
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Color Theme Accent
            </label>
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
              {loading ? "Saving..." : initialData ? "Update Account" : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
