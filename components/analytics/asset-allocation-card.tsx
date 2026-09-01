"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { AssetAllocationItem } from "@/lib/actions/analytics.actions";
import { Wallet, Landmark, PiggyBank, Smartphone, Banknote } from "lucide-react";

interface AssetAllocationCardProps {
  currency?: string;
  accounts: AssetAllocationItem[];
}

const accountTypeIcons: Record<string, any> = {
  bank: Landmark,
  savings: PiggyBank,
  e_wallet: Smartphone,
  cash: Banknote,
  investment: Wallet,
  credit_card: Wallet,
};

export function AssetAllocationCard({ accounts, currency = 'USD' }: AssetAllocationCardProps) {
  const totalHoldings = accounts.reduce(
    (sum, acc) => sum + Math.max(acc.balance, 0),
    0
  );

  if (!accounts || accounts.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-catamaran font-bold text-slate-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-400" />
            Liquid Asset Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-slate-400 text-xs">
          No active financial accounts found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-catamaran font-bold text-slate-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-400" />
            Liquid Asset Allocation
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Holdings distributed across accounts & wallets
          </p>
        </div>
        <span className="text-xs font-semibold text-blue-400 font-catamaran">
          Net: {formatCurrency(totalHoldings, currency)}
        </span>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Multi-segment Colored Ratio Bar */}
        <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden p-0.5 gap-0.5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="h-full rounded-xs transition-all duration-300 hover:opacity-80"
              style={{
                width: `${Math.max(acc.percentage, 2)}%`,
                backgroundColor: acc.color || "#3B82F6",
              }}
              title={`${acc.name}: ${acc.percentage}%`}
            />
          ))}
        </div>

        {/* Account List with Proportional Meters */}
        <div className="space-y-3 pt-2">
          {accounts.map((acc) => {
            const Icon = accountTypeIcons[acc.type] || Wallet;
            return (
              <div
                key={acc.id}
                className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1 rounded-md text-white"
                      style={{ backgroundColor: `${acc.color}25` }}
                    >
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: acc.color }}
                      />
                    </div>
                    <div>
                      <span className="font-medium text-slate-200">
                        {acc.name}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase ml-1.5 font-semibold">
                        {acc.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold font-catamaran ${
                        acc.balance >= 0 ? "text-slate-100" : "text-rose-400"
                      }`}
                    >
                      {formatCurrency(acc.balance, currency)}
                    </span>
                    <span className="font-semibold text-[11px] text-slate-400 w-8 text-right font-catamaran">
                      {acc.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Line */}
                <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${acc.percentage}%`,
                      backgroundColor: acc.color || "#3B82F6",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
