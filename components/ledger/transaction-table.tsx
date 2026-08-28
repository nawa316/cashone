"use client";

import React, { useState, useMemo } from "react";
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
  Filter,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ReceiptLightbox } from "@/components/ledger/receipt-lightbox";

interface TransactionTableProps {
  transactions: any[];
}

export function TransactionTable({ transactions = [] }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAccount, setFilterAccount] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");
  const [activeTxForReceipt, setActiveTxForReceipt] = useState<any | null>(null);

  // Extract unique accounts and categories from transactions
  const uniqueAccounts = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    transactions.forEach((tx) => {
      if (tx.account) map.set(tx.account.id, { id: tx.account.id, name: tx.account.name });
      if (tx.destination_account) map.set(tx.destination_account.id, { id: tx.destination_account.id, name: tx.destination_account.name });
    });
    return Array.from(map.values());
  }, [transactions]);

  const uniqueCategories = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    transactions.forEach((tx) => {
      if (tx.category) map.set(tx.category.id, { id: tx.category.id, name: tx.category.name });
    });
    return Array.from(map.values());
  }, [transactions]);

  const filtered = useMemo(() => {
    const now = new Date();

    return transactions
      .filter((tx) => {
        // 1. Type filter
        if (filterType !== "all" && tx.type !== filterType) return false;

        // 2. Account filter
        if (filterAccount !== "all") {
          if (tx.account_id !== filterAccount && tx.destination_account_id !== filterAccount) {
            return false;
          }
        }

        // 3. Category filter
        if (filterCategory !== "all") {
          if (tx.category_id !== filterCategory) return false;
        }

        // 4. Date Range filter
        if (dateRange !== "all") {
          const txDate = new Date(tx.transaction_date);
          const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);

          if (dateRange === "7d" && diffDays > 7) return false;
          if (dateRange === "30d" && diffDays > 30) return false;
          if (dateRange === "90d" && diffDays > 90) return false;
          if (dateRange === "365d" && diffDays > 365) return false;
        }

        // 5. Search query
        if (searchTerm) {
          const query = searchTerm.toLowerCase();
          const notes = (tx.notes || "").toLowerCase();
          const catName = (tx.category?.name || "").toLowerCase();
          const accName = (tx.account?.name || "").toLowerCase();
          const destName = (tx.destination_account?.name || "").toLowerCase();

          if (
            !notes.includes(query) &&
            !catName.includes(query) &&
            !accName.includes(query) &&
            !destName.includes(query)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date_desc") {
          return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
        }
        if (sortBy === "date_asc") {
          return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
        }
        if (sortBy === "amount_desc") {
          return Number(b.amount || 0) - Number(a.amount || 0);
        }
        if (sortBy === "amount_asc") {
          return Number(a.amount || 0) - Number(b.amount || 0);
        }
        return 0;
      });
  }, [transactions, filterType, filterAccount, filterCategory, dateRange, searchTerm, sortBy]);

  return (
    <div className="space-y-4">
      {/* Search & Multi-Filter Toolbar */}
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, payee, category, account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            {["all", "income", "expense", "transfer"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                  filterType === type
                    ? "bg-slate-800 text-white font-bold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Filters Ribbon */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
          {/* Account Filter */}
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="h-8 px-2.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Accounts</option>
            {uniqueAccounts.map((acc) => (
              <option key={acc.id} value={acc.id} className="bg-slate-900">
                {acc.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-8 px-2.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-900">
                {cat.name}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-8 px-2.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="365d">Past Year</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 px-2.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500 ml-auto"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>

          <span className="text-[11px] text-slate-500 font-medium pl-1">
            {filtered.length} of {transactions.length} records
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-dashed border-slate-800 space-y-1">
          <p className="text-sm font-semibold text-slate-300">No transactions found</p>
          <p className="text-xs text-slate-500">
            {searchTerm || filterType !== "all" || filterAccount !== "all" || filterCategory !== "all"
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
