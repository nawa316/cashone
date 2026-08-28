import React from "react";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { getTransactions } from "@/lib/actions/transactions.actions";
import { AccountsHeader } from "@/components/accounts/accounts-header";
import { AccountsView } from "@/components/accounts/accounts-view";
import { calculateConsolidatedNetWorth } from "@/lib/utils/currency";

export default async function AccountsPage() {
  const [accounts, transactions] = await Promise.all([
    getAccounts(),
    getTransactions(),
  ]);

  const totalBalance = calculateConsolidatedNetWorth(accounts, "USD");

  return (
    <div className="space-y-8">
      {/* Header with Add Account CTA & Total Consolidated Holdings */}
      <AccountsHeader totalBalance={totalBalance} />

      {/* Grouped Accounts View with In-Place Edit & Detail Drawer Support */}
      <AccountsView accounts={accounts} transactions={transactions} />
    </div>
  );
}
