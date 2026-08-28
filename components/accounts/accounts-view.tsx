"use client";

import React, { useState } from "react";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountDialog } from "@/components/accounts/account-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, PieChart } from "lucide-react";
import type { Account } from "@/lib/actions/accounts.actions";

interface AccountsViewProps {
  accounts: Account[];
}

export function AccountsView({ accounts = [] }: AccountsViewProps) {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (acc: Account) => {
    setEditingAccount(acc);
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingAccount(null);
    }
  };

  // Group accounts
  const liquidAccounts = accounts.filter((acc) =>
    ["bank", "savings", "e_wallet", "cash"].includes(acc.type)
  );
  const assetAndCreditAccounts = accounts.filter((acc) =>
    ["investment", "credit_card"].includes(acc.type)
  );

  return (
    <>
      {/* Cash & Daily Banking Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-catamaran text-lg font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Cash & Daily Banking
            </h2>
            <p className="text-xs text-slate-400">
              Checking accounts, high-yield savings, digital wallets, and physical cash.
            </p>
          </div>
          <span className="text-xs font-catamaran font-semibold text-slate-300">
            {liquidAccounts.length} Accounts
          </span>
        </div>

        {liquidAccounts.length === 0 ? (
          <Card className="glass-card border-dashed border-slate-800">
            <CardContent className="p-8 text-center space-y-2">
              <p className="text-sm text-slate-400">No banking or cash accounts added yet.</p>
              <p className="text-xs text-slate-500">
                Click &quot;Add Account&quot; above to create your first bank or wallet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liquidAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Investments & Credit Accounts Section */}
      <div className="space-y-4 pt-6 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-catamaran text-lg font-bold text-slate-100 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Investments & Credit Facilities
            </h2>
            <p className="text-xs text-slate-400">
              Long-term investment holdings, mutual funds, and credit card accounts.
            </p>
          </div>
          <span className="text-xs font-catamaran font-semibold text-emerald-400">
            {assetAndCreditAccounts.length} Accounts
          </span>
        </div>

        {assetAndCreditAccounts.length === 0 ? (
          <Card className="glass-card border-dashed border-slate-800">
            <CardContent className="p-8 text-center space-y-2">
              <p className="text-sm text-slate-400">No investment or credit accounts configured.</p>
              <p className="text-xs text-slate-500">
                Add an investment portfolio or credit card to track your complete balance sheet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetAndCreditAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {dialogOpen && (
        <AccountDialog
          open={dialogOpen}
          onOpenChange={handleCloseDialog}
          initialData={editingAccount}
        />
      )}
    </>
  );
}
