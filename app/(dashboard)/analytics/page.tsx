import React from "react";
import { getAnalyticsData } from "@/lib/actions/analytics.actions";
import { getTransactions } from "@/lib/actions/transactions.actions";
import { getUserProfile } from "@/lib/actions/profile.actions";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { CashflowChart } from "@/components/analytics/cashflow-chart";
import { CategoryBreakdownCard } from "@/components/analytics/category-breakdown-card";
import { AssetAllocationCard } from "@/components/analytics/asset-allocation-card";
import { FxConverterWidget } from "@/components/analytics/fx-converter-widget";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Percent,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsPageProps {
  searchParams: Promise<{ timeframe?: string }>;
}

export default async function AnalyticsPage(props: AnalyticsPageProps) {
  const searchParams = await props.searchParams;
  const timeframe = (searchParams?.timeframe || "30d") as
    | "7d"
    | "30d"
    | "3m"
    | "6m"
    | "12m"
    | "all";

  const [analytics, transactions, profile] = await Promise.all([
    getAnalyticsData(timeframe),
    getTransactions(),
    getUserProfile(),
  ]);
  const currency = profile?.default_currency || "USD";

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <AnalyticsHeader
        transactions={transactions}
        currentTimeframe={timeframe}
      />

      {/* Top Analytical KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Period Inflow
              </span>
              <span className="font-catamaran font-bold text-xl text-emerald-400">
                +{formatCurrency(analytics.totalIncome, currency)}
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
                Period Outflow
              </span>
              <span className="font-catamaran font-bold text-xl text-rose-400">
                -{formatCurrency(analytics.totalExpense, currency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Net Savings */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Net Period Savings
              </span>
              <span
                className={`font-catamaran font-bold text-xl ${
                  analytics.netSavings >= 0 ? "text-blue-400" : "text-rose-400"
                }`}
              >
                {analytics.netSavings >= 0 ? "+" : ""}
                {formatCurrency(analytics.netSavings, currency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
              <PiggyBank className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate % */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Savings Efficiency
              </span>
              <span className="font-catamaran font-bold text-xl text-indigo-400">
                {analytics.savingsRate}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400">
              <Percent className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Cashflow Trajectory Chart */}
      <CashflowChart data={analytics.cashflowTrend} currency={currency} />

      {/* 2-Column Analytics: Category Breakdown & Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownCard
          categories={analytics.categoryBreakdown}
          totalExpense={analytics.totalExpense}
          currency={currency}
        />
        <AssetAllocationCard accounts={analytics.assetAllocation} currency={currency} />
      </div>

      {/* Interactive FX Converter Tool */}
      <FxConverterWidget />
    </div>
  );
}
