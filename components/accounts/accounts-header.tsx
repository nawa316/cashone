"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AccountDialog } from "@/components/accounts/account-dialog";
import { Plus, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function AccountsHeader({
  totalBalance = 0,
  currency = "USD",
}: {
  totalBalance?: number;
  currency?: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Wallet className="w-3.5 h-3.5" />
            Consolidated Holdings
          </span>
          <div className="font-catamaran text-3xl font-bold text-slate-100">
            {formatCurrency(totalBalance, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total liquidity across bank accounts, savings, e-wallets, and cash holdings.
          </p>
        </div>

        <div>
          <Button onClick={() => setDialogOpen(true)} className="font-semibold text-xs shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
        </div>
      </div>

      <AccountDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
