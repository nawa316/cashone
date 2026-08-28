"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  FileCode,
  Printer,
} from "lucide-react";
import {
  exportTransactionsToCSV,
  exportTransactionsToJSON,
} from "@/lib/utils/export";
import type { Transaction } from "@/lib/actions/transactions.actions";

interface AnalyticsHeaderProps {
  transactions: Transaction[];
  currentTimeframe: string;
}

const timeframes = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "3 Months", value: "3m" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "12m" },
  { label: "All Time", value: "all" },
];

export function AnalyticsHeader({
  transactions,
  currentTimeframe,
}: AnalyticsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTimeframeChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeframe", val);
    router.push(`/analytics?${params.toString()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
      <div>
        <h1 className="font-catamaran text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          Financial Analytics & Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          In-depth cashflow trajectory, category spending dynamics, and asset allocation.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Timeframe Pill Filter */}
        <div className="flex items-center p-1 rounded-lg bg-slate-900/80 border border-slate-800">
          {timeframes.map((tf) => {
            const isSelected = currentTimeframe === tf.value;
            return (
              <button
                key={tf.value}
                onClick={() => handleTimeframeChange(tf.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* Quick Export & Print Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            className="text-xs"
            onClick={() => exportTransactionsToCSV(transactions)}
            title="Download CSV Ledger"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            CSV
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="text-xs"
            onClick={() => exportTransactionsToJSON(transactions)}
            title="Download JSON Report"
          >
            <FileCode className="w-3.5 h-3.5" />
            JSON
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="text-xs"
            onClick={handlePrint}
            title="Print Executive Financial Report"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}
