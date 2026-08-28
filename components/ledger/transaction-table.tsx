"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteTransaction } from "@/lib/actions/transactions.actions";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Trash2,
  Receipt,
  Search,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ReceiptLightbox } from "@/components/ledger/receipt-lightbox";

interface TransactionTableProps {
  transactions: any[];
}

export function TransactionTable({ transactions = [] }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [activeTxForReceipt, setActiveTxForReceipt] = useState<any | null>(null);

  const filtered = transactions.filter((tx) => {
    const matchesType = filterType === "all" || tx.type === filterType;
    const notes = tx.notes || "";
    const categoryName = tx.category?.name || "";
    const accountName = tx.account?.name || "";
    const destName = tx.destination_account?.name || "";

    const matchesSearch =
      notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, category, account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {["all", "income", "expense", "transfer"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                filterType === type
                  ? "bg-slate-800 text-white font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-dashed border-slate-800 space-y-1">
          <p className="text-sm font-semibold text-slate-300">No transactions found</p>
          <p className="text-xs text-slate-500">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search query or filters."
              : "Click '+ Record Transaction' above to log your first cash flow."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Account / Route</TableHead>
              <TableHead>Category / Memo</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-20 text-center">Receipt</TableHead>
              <TableHead className="w-16 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tx) => {
              const formattedDate = new Date(tx.transaction_date).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
              );

              return (
                <TableRow key={tx.id} className="group">
                  {/* Date */}
                  <TableCell className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {formattedDate}
                  </TableCell>

                  {/* Type Badge */}
                  <TableCell>
                    <Badge
                      variant={
                        tx.type === "income"
                          ? "profit"
                          : tx.type === "expense"
                          ? "loss"
                          : "default"
                      }
                      className="text-[10px] capitalize"
                    >
                      {tx.type === "income" ? (
                        <ArrowDownLeft className="w-3 h-3 inline mr-1" />
                      ) : tx.type === "expense" ? (
                        <ArrowUpRight className="w-3 h-3 inline mr-1" />
                      ) : (
                        <ArrowLeftRight className="w-3 h-3 inline mr-1" />
                      )}
                      {tx.type}
                    </Badge>
                  </TableCell>

                  {/* Account / Route */}
                  <TableCell>
                    {tx.type === "transfer" ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <span style={{ color: tx.account?.color_hex || "#94A3B8" }}>
                          {tx.account?.name || "Source"}
                        </span>
                        <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                        <span style={{ color: tx.destination_account?.color_hex || "#94A3B8" }}>
                          {tx.destination_account?.name || "Destination"}
                        </span>
                      </div>
                    ) : (
                      <span
                        className="text-xs font-semibold"
                        style={{ color: tx.account?.color_hex || "#94A3B8" }}
                      >
                        {tx.account?.name || "Account"}
                      </span>
                    )}
                  </TableCell>

                  {/* Category & Memo */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="text-xs text-slate-200 font-medium block">
                        {tx.category?.name || "Uncategorized"}
                      </span>
                      {tx.notes && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {tx.notes}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Amount with Color */}
                  <TableCell className="text-right font-catamaran font-bold text-sm">
                    <span
                      className={
                        tx.type === "income"
                          ? "text-emerald-400"
                          : tx.type === "expense"
                          ? "text-rose-400"
                          : "text-blue-400"
                      }
                    >
                      {tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}
                      {formatCurrency(tx.amount, tx.currency)}
                    </span>
                    {tx.fee > 0 && (
                      <span className="block text-[10px] text-slate-500 font-normal">
                        Fee: {formatCurrency(tx.fee, tx.currency)}
                      </span>
                    )}
                  </TableCell>

                  {/* Receipt Lightbox Trigger */}
                  <TableCell className="text-center">
                    {tx.receipt_url ? (
                      <button
                        onClick={() => setActiveTxForReceipt(tx)}
                        className="p-1.5 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-white transition-colors"
                        title="View Receipt Lightbox"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </TableCell>

                  {/* Delete Action */}
                  <TableCell className="text-right">
                    <form
                      action={async () => {
                        if (confirm("Delete this transaction? Balances will automatically revert.")) {
                          await deleteTransaction(tx.id);
                        }
                      }}
                    >
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Enhanced Receipt Lightbox Modal */}
      {activeTxForReceipt && (
        <ReceiptLightbox
          receiptUrl={activeTxForReceipt.receipt_url}
          transaction={activeTxForReceipt}
          onClose={() => setActiveTxForReceipt(null)}
        />
      )}
    </div>
  );
}
