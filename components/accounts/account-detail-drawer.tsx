"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Edit2,
  Calendar,
  DollarSign,
  Receipt,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AccountDetailDrawerProps {
  account: any | null;
  transactions: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (account: any) => void;
}

export function AccountDetailDrawer({
  account,
  transactions = [],
  open,
  onOpenChange,
  onEdit,
}: AccountDetailDrawerProps) {
  if (!account) return null;

  // Filter transactions for this account
  const accountTransactions = useMemo(() => {
    return transactions.filter(
      (tx) =>
        tx.account_id === account.id || tx.destination_account_id === account.id
    );
  }, [transactions, account]);

  // Aggregate stats for this account
  const { totalInflow, totalOutflow } = useMemo(() => {
    let inflow = 0;
    let outflow = 0;

    accountTransactions.forEach((tx) => {
      const amount = Number(tx.amount || 0);
      const fee = Number(tx.fee || 0);

      if (tx.type === "income") {
        inflow += amount;
      } else if (tx.type === "expense") {
        outflow += amount + fee;
      } else if (tx.type === "transfer") {
        if (tx.destination_account_id === account.id) {
          inflow += amount;
        }
        if (tx.account_id === account.id) {
          outflow += amount + fee;
        }
      }
    });

    return { totalInflow: inflow, totalOutflow: outflow };
  }, [accountTransactions, account]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-slate-100 p-0 overflow-hidden">
        {/* Account Header Hero */}
        <div
          className="p-6 border-b border-slate-800/80"
          style={{
            background: `linear-gradient(135deg, ${account.color_hex}15 0%, #020617 100%)`,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: account.color_hex }}
              >
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold font-catamaran text-white">
                  {account.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className="text-[10px] uppercase">
                    {account.type.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    Currency: {account.currency}
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                onOpenChange(false);
                onEdit(account);
              }}
              className="text-xs font-semibold"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Account
            </Button>
          </div>

          {/* Balance & Flow Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800/60">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Current Balance
              </span>
              <div className="font-catamaran font-bold text-lg text-slate-100 mt-0.5">
                {formatCurrency(account.balance, account.currency)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">
                Total Inflow
              </span>
              <div className="font-catamaran font-bold text-lg text-emerald-400 mt-0.5">
                +{formatCurrency(totalInflow, account.currency)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold block">
                Total Outflow
              </span>
              <div className="font-catamaran font-bold text-lg text-rose-400 mt-0.5">
                -{formatCurrency(totalOutflow, account.currency)}
              </div>
            </div>
          </div>
        </div>

        {/* Account Isolated Transactions */}
        <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Account Transaction History
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              {accountTransactions.length} records
            </span>
          </div>

          {accountTransactions.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-1">
              <p className="text-xs font-semibold text-slate-300">No transactions for this account</p>
              <p className="text-[11px] text-slate-500">
                Income, expenses, or transfers involving this account will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {accountTransactions.map((tx) => {
                const isDeposit =
                  tx.type === "income" ||
                  (tx.type === "transfer" && tx.destination_account_id === account.id);

                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-md ${
                          isDeposit
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">
                          {tx.notes || tx.category?.name || "Transaction"}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(tx.transaction_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-catamaran font-bold ${
                          isDeposit ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isDeposit ? "+" : "-"}
                        {formatCurrency(tx.amount, tx.currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
