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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { uploadReceipt } from "@/lib/actions/storage.actions";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  UploadCloud,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: any[];
  categories: any[];
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  accounts = [],
  categories = [],
}: TransactionFormDialogProps) {
  const [type, setType] = useState<"income" | "expense" | "transfer">("expense");
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || "");
  const [destinationAccountId, setDestinationAccountId] = useState(
    accounts[1]?.id || ""
  );
  const [amount, setAmount] = useState<string>("");
  const [fee, setFee] = useState<string>("0");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourceAccount = accounts.find((a) => a.id === sourceAccountId);
  const destAccount = accounts.find((a) => a.id === destinationAccountId);

  const numericAmount = parseFloat(amount) || 0;
  const numericFee = parseFloat(fee) || 0;

  // Handle Receipt Upload to Supabase Storage
  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReceipt(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadReceipt(formData);
      if (res.success && res.url) {
        setReceiptUrl(res.url);
      } else {
        setError(res.error || "Failed to upload receipt");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload receipt");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("type", type);
    formData.set("account_id", sourceAccountId);
    formData.set("currency", sourceAccount?.currency || "USD");
    if (type === "transfer") {
      formData.set("destination_account_id", destinationAccountId);
    }
    if (receiptUrl) {
      formData.set("receipt_url", receiptUrl);
    }

    try {
      const result = await createTransaction(formData);
      if (result.success) {
        setAmount("");
        setFee("0");
        setReceiptUrl(null);
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to save transaction");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) => type === "transfer" || c.type === type
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Transaction</DialogTitle>
          <DialogDescription>
            Log cash flows, income, expenses, or execute atomic double-entry inter-account transfers.
          </DialogDescription>
        </DialogHeader>

        {/* Transaction Type Segmented Switch */}
        <Tabs
          defaultValue={type}
          value={type}
          onValueChange={(val) => setType(val as any)}
          className="mb-4"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger
              value="expense"
              className="data-[state=selected]:text-rose-400 flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              Expense
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="data-[state=selected]:text-emerald-400 flex items-center gap-1.5"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Income
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="data-[state=selected]:text-blue-400 flex items-center gap-1.5"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Transfer
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Amount & Fee Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {type === "transfer" ? "Transfer Amount" : "Amount"} ({sourceAccount?.currency || "USD"})
              </label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-slate-900 border-slate-700 font-catamaran text-lg font-bold"
              />
            </div>

            {type === "transfer" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Transfer Fee (Optional)
                </label>
                <Input
                  name="fee"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="bg-slate-900 border-slate-700 font-catamaran"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Transaction Date
                </label>
                <Input
                  name="transaction_date"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                  className="bg-slate-900 border-slate-700 text-xs"
                />
              </div>
            )}
          </div>

          {/* Account Selection */}
          {type === "transfer" ? (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  From (Source Account)
                </label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100"
                  required
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  To (Destination Account)
                </label>
                <select
                  value={destinationAccountId}
                  onChange={(e) => setDestinationAccountId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100"
                  required
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id} disabled={acc.id === sourceAccountId}>
                      {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Transfer Preview */}
              {numericAmount > 0 && sourceAccount && destAccount && (
                <div className="col-span-2 text-[11px] pt-2 border-t border-slate-800/80 text-slate-400 flex justify-between">
                  <span>
                    {sourceAccount.name}:{" "}
                    <strong className="text-rose-400 font-catamaran">
                      {formatCurrency(
                        sourceAccount.balance - (numericAmount + numericFee),
                        sourceAccount.currency
                      )}
                    </strong>
                  </span>
                  <span>
                    {destAccount.name}:{" "}
                    <strong className="text-emerald-400 font-catamaran">
                      {formatCurrency(
                        destAccount.balance + numericAmount,
                        destAccount.currency
                      )}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {type === "income" ? "Deposit To (Account)" : "Withdraw From (Account)"}
                </label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  required
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatCurrency(acc.balance, acc.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {type === "income" ? "Income Category" : "Expense Category"}
                </label>
                <select
                  name="category_id"
                  className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                >
                  <option value="">Uncategorized</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Notes Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Notes / Memo</label>
            <Input
              name="notes"
              placeholder="e.g. Monthly cloud server fee, dividend payout..."
              className="bg-slate-900 border-slate-700 text-xs"
            />
          </div>

          {/* Receipt Upload to Supabase Storage */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Receipt Attachment (Supabase Storage)</span>
              {receiptUrl && (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <FileCheck className="w-3 h-3" /> Attached
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer text-xs text-slate-400 transition-colors">
                <UploadCloud className="w-4 h-4 text-blue-400" />
                <span>
                  {uploadingReceipt
                    ? "Uploading to Supabase..."
                    : receiptUrl
                    ? "Change Receipt Image"
                    : "Upload Receipt (JPEG/PNG/PDF)"}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptUpload}
                  disabled={uploadingReceipt}
                  className="hidden"
                />
              </label>
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
            <Button
              type="submit"
              variant={type === "income" ? "profit" : type === "expense" ? "destructive" : "default"}
              disabled={loading || uploadingReceipt}
            >
              {loading ? "Recording..." : `Record ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
