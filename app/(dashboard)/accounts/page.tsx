import React from "react";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { getTransactions } from "@/lib/actions/transactions.actions";
import { getUserProfile } from "@/lib/actions/profile.actions";
import { AccountsHeader } from "@/components/accounts/accounts-header";
import { AccountsView } from "@/components/accounts/accounts-view";
import { calculateConsolidatedNetWorth } from "@/lib/utils/currency";

export default async function AccountsPage() {
  const [accounts, transactions, profile] = await Promise.all([
    getAccounts(),
    getTransactions(),
    getUserProfile(),
  ]);

  const userCurrency = profile?.default_currency || "USD";
  const totalBalance = calculateConsolidatedNetWorth(accounts, userCurrency);

  return (
    <div className="space-y-8">
      {/* Header with Add Account CTA & Total Consolidated Holdings */}
      <AccountsHeader totalBalance={totalBalance} currency={userCurrency} />

      {/* Grouped Accounts View with In-Place Edit & Detail Drawer Support */}
      <AccountsView accounts={accounts} transactions={transactions} />
    </div>
  );
}
