import React from "react";
import { getTransactions } from "@/lib/actions/transactions.actions";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { getCategories } from "@/lib/actions/categories.actions";
import { getUserProfile } from "@/lib/actions/profile.actions";
import { TransactionsHeader } from "@/components/ledger/transactions-header";
import { TransactionTable } from "@/components/ledger/transaction-table";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function TransactionsPage() {
  const [transactions, accounts, categories, profile] = await Promise.all([
    getTransactions(),
    getAccounts(),
    getCategories(),
    getUserProfile(),
  ]);

  const userCurrency = profile?.default_currency || "USD";

  const totalInflow = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalOutflow = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0) + Number(t.fee || 0), 0);

  const totalTransfers = transactions
    .filter((t) => t.type === "transfer")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <TransactionsHeader
        accounts={accounts}
        categories={categories}
        transactions={transactions}
      />

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Inflow */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Total Inflow
              </span>
              <span className="font-catamaran font-bold text-xl text-emerald-400">
                +{formatCurrency(totalInflow, userCurrency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Outflow */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Total Outflow
              </span>
              <span className="font-catamaran font-bold text-xl text-rose-400">
                -{formatCurrency(totalOutflow, userCurrency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Inter-Account Transfers */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Inter-Account Transfers
              </span>
              <span className="font-catamaran font-bold text-xl text-blue-400">
                {formatCurrency(totalTransfers, userCurrency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Ledger Table */}
      <TransactionTable transactions={transactions} />
    </div>
  );
}
