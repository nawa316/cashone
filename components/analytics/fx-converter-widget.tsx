"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Coins, RefreshCw } from "lucide-react";
import { convertCurrency, EXCHANGE_RATES_TO_USD } from "@/lib/utils/currency";
import { formatCurrency } from "@/lib/utils";

const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "IDR", "SGD", "CAD", "AUD"];

export function FxConverterWidget() {
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");

  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount = convertCurrency(numericAmount, fromCurrency, toCurrency);

  // Rate for 1 unit of fromCurrency in toCurrency
  const unitRate = convertCurrency(1, fromCurrency, toCurrency);

  const handleSwap = () => {
    const prevFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(prevFrom);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
        <CardTitle className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Coins className="w-4 h-4 text-blue-400" />
          Live FX Currency Calculator
        </CardTitle>
        <span className="text-[10px] text-slate-500 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Base Pegged Rates
        </span>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
          {/* From Input */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Amount & Source
            </label>
            <div className="flex rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm font-catamaran font-bold bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-hidden"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="px-2.5 bg-slate-900 text-xs font-bold text-slate-300 border-l border-slate-800 focus:outline-hidden"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr} value={curr} className="bg-slate-900">
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all shadow-sm"
              title="Swap Currencies"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* To Converted Display */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Converted Result
            </label>
            <div className="flex rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
              <div className="w-full px-3 py-2 text-sm font-catamaran font-bold text-emerald-400 truncate flex items-center">
                {formatCurrency(convertedAmount, toCurrency)}
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="px-2.5 bg-slate-900 text-xs font-bold text-slate-300 border-l border-slate-800 focus:outline-hidden"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr} value={curr} className="bg-slate-900">
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exchange Rate Badge */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 text-slate-400">
          <span>
            Exchange Rate: 1 {fromCurrency} ={" "}
            <span className="text-slate-200 font-semibold font-catamaran">
              {unitRate < 0.01 ? unitRate.toFixed(6) : unitRate.toFixed(4)} {toCurrency}
            </span>
          </span>
          <span className="text-[11px] text-slate-500">Instant multi-account math</span>
        </div>
      </CardContent>
    </Card>
  );
}
