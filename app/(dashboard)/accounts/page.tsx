import React from "react";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { AccountsHeader } from "@/components/accounts/accounts-header";
import { AccountsView } from "@/components/accounts/accounts-view";

export default async function AccountsPage() {
  const accounts = await getAccounts();
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header with Add Account CTA & Total Consolidated Holdings */}
      <AccountsHeader totalBalance={totalBalance} />

      {/* Grouped Accounts View with In-Place Edit Support */}
      <AccountsView accounts={accounts} />
    </div>
  );
}
