import React from "react";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { AccountCard } from "@/components/accounts/account-card";
import { AccountsHeader } from "@/components/accounts/accounts-header";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, PiggyBank, Smartphone, Wallet, CreditCard, PieChart } from "lucide-react";

export default async function AccountsPage() {
  const accounts = await getAccounts();

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  // Group accounts
  const liquidAccounts = accounts.filter((acc) =>
    ["bank", "savings", "e_wallet", "cash"].includes(acc.type)
  );
  const assetAndCreditAccounts = accounts.filter((acc) =>
    ["investment", "credit_card"].includes(acc.type)
  );

  return (
    <div className="space-y-8">
      {/* Header with Add Account CTA & Total Consolidated Holdings */}
      <AccountsHeader totalBalance={totalBalance} />

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
              <p className="text-xs text-slate-500">Click &quot;Add Account&quot; above to create your first bank or wallet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liquidAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
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
              <p className="text-xs text-slate-500">Add an investment portfolio or credit card to track your complete balance sheet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetAndCreditAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
