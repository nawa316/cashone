"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DailyTrendPoint } from "@/lib/utils/analytics";
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";

interface WeeklyTrendChartProps {
  data: DailyTrendPoint[];
  currency?: string;
}

export function WeeklyTrendChart({
  data,
  currency = "USD",
}: WeeklyTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);
  const [showTransfer, setShowTransfer] = useState(true);

  // Aggregated 7-day totals
  const totals = useMemo(() => {
    return data.reduce(
      (acc, d) => ({
        income: acc.income + d.income,
        expense: acc.expense + d.expense,
        transfer: acc.transfer + d.transfer,
        net: acc.net + d.net,
      }),
      { income: 0, expense: 0, transfer: 0, net: 0 }
    );
  }, [data]);

  // SVG Chart Geometry Constants
  const width = 700;
  const height = 220;
  const padding = { top: 25, bottom: 35, left: 55, right: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Compute maximum value for Y-axis scaling with safety fallback
  const maxDataVal = Math.max(
    ...data.map((d) =>
      Math.max(
        showIncome ? d.income : 0,
        showExpense ? d.expense : 0,
        showTransfer ? d.transfer : 0
      )
    ),
    0
  );
  const maxVal = maxDataVal > 0 ? maxDataVal * 1.15 : 100;

  // Grid steps (4 horizontal reference lines)
  const yTicks = [0, maxVal * 0.33, maxVal * 0.66, maxVal];

  // Helper to map index & value to SVG coordinate
  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(0, val);
    return padding.top + chartHeight - (clamped / maxVal) * chartHeight;
  };

  // Generate smooth SVG Bézier curves
  const generatePath = (
    points: { x: number; y: number }[],
    isArea: boolean = false
  ) => {
    if (points.length === 0) return "";
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(
        1
      )} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    if (isArea) {
      const lastX = points[points.length - 1].x;
      const firstX = points[0].x;
      const baselineY = padding.top + chartHeight;
      d += ` L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
    }

    return d;
  };

  // Coordinate arrays
  const incomePoints = useMemo(
    () => data.map((d, i) => ({ x: getX(i), y: getY(d.income) })),
    [data, maxVal]
  );
  const expensePoints = useMemo(
    () => data.map((d, i) => ({ x: getX(i), y: getY(d.expense) })),
    [data, maxVal]
  );
  const transferPoints = useMemo(
    () => data.map((d, i) => ({ x: getX(i), y: getY(d.transfer) })),
    [data, maxVal]
  );

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-catamaran font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            7-Day Activity & Cashflow
          </CardTitle>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily comparison of Income, Expense, and Inter-Account Transfers
          </p>
        </div>

        {/* Interactive Legend & Series Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowIncome(!showIncome)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              showIncome
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-slate-800/40 text-slate-500 border border-slate-800 line-through opacity-60"
            }`}
            title="Toggle Income line"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                showIncome ? "bg-emerald-400 ring-2 ring-emerald-400/20" : "bg-slate-500"
              }`}
            />
            <span>Income</span>
            {showIncome ? (
              <Eye className="w-3 h-3 ml-0.5 opacity-60" />
            ) : (
              <EyeOff className="w-3 h-3 ml-0.5 opacity-60" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowExpense(!showExpense)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              showExpense
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : "bg-slate-800/40 text-slate-500 border border-slate-800 line-through opacity-60"
            }`}
            title="Toggle Expense line"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                showExpense ? "bg-rose-400 ring-2 ring-rose-400/20" : "bg-slate-500"
              }`}
            />
            <span>Expense</span>
            {showExpense ? (
              <Eye className="w-3 h-3 ml-0.5 opacity-60" />
            ) : (
              <EyeOff className="w-3 h-3 ml-0.5 opacity-60" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowTransfer(!showTransfer)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              showTransfer
                ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                : "bg-slate-800/40 text-slate-500 border border-slate-800 line-through opacity-60"
            }`}
            title="Toggle Transfer line"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                showTransfer ? "bg-sky-400 ring-2 ring-sky-400/20" : "bg-slate-500"
              }`}
            />
            <span>Transfer</span>
            {showTransfer ? (
              <Eye className="w-3 h-3 ml-0.5 opacity-60" />
            ) : (
              <EyeOff className="w-3 h-3 ml-0.5 opacity-60" />
            )}
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* SVG Chart Surface */}
        <div className="relative w-full">
          <div className="w-full aspect-[21/9] min-h-[200px] max-h-[280px]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full overflow-visible select-none"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Income Gradient */}
                <linearGradient id="income-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                {/* Expense Gradient */}
                <linearGradient id="expense-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                </linearGradient>
                {/* Transfer Gradient */}
                <linearGradient id="transfer-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines & Y-Axis Labels */}
              {yTicks.map((val, idx) => {
                const yPos = getY(val);
                return (
                  <g key={idx}>
                    <line
                      x1={padding.left}
                      y1={yPos}
                      x2={width - padding.right}
                      y2={yPos}
                      stroke="#334155"
                      strokeDasharray="4 4"
                      strokeOpacity={0.4}
                      strokeWidth={1}
                    />
                    <text
                      x={padding.left - 8}
                      y={yPos + 3}
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {formatCurrency(Math.round(val), currency).split(".")[0]}
                    </text>
                  </g>
                );
              })}

              {/* Area Fills */}
              {showIncome && (
                <path
                  d={generatePath(incomePoints, true)}
                  fill="url(#income-glow)"
                  className="transition-all duration-300"
                />
              )}
              {showExpense && (
                <path
                  d={generatePath(expensePoints, true)}
                  fill="url(#expense-glow)"
                  className="transition-all duration-300"
                />
              )}
              {showTransfer && (
                <path
                  d={generatePath(transferPoints, true)}
                  fill="url(#transfer-glow)"
                  className="transition-all duration-300"
                />
              )}

              {/* Multi-Line Curves */}
              {showIncome && (
                <path
                  d={generatePath(incomePoints)}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
                />
              )}
              {showExpense && (
                <path
                  d={generatePath(expensePoints)}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]"
                />
              )}
              {showTransfer && (
                <path
                  d={generatePath(transferPoints)}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300 drop-shadow-[0_2px_6px_rgba(56,189,248,0.3)]"
                />
              )}

              {/* Hover Cursor Vertical Line */}
              {hoveredIndex !== null && (
                <line
                  x1={getX(hoveredIndex)}
                  y1={padding.top}
                  x2={getX(hoveredIndex)}
                  y2={padding.top + chartHeight}
                  stroke="#94A3B8"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  strokeOpacity={0.7}
                />
              )}

              {/* Data Point Nodes (Interactive Dots) */}
              {data.map((_, i) => {
                const x = getX(i);
                const isHovered = hoveredIndex === i;

                return (
                  <g key={i}>
                    {/* Income Point */}
                    {showIncome && (
                      <circle
                        cx={x}
                        cy={incomePoints[i].y}
                        r={isHovered ? 5.5 : 3.5}
                        fill="#0F172A"
                        stroke="#10B981"
                        strokeWidth={isHovered ? 2.5 : 2}
                        className="transition-all duration-150"
                      />
                    )}

                    {/* Expense Point */}
                    {showExpense && (
                      <circle
                        cx={x}
                        cy={expensePoints[i].y}
                        r={isHovered ? 5.5 : 3.5}
                        fill="#0F172A"
                        stroke="#F43F5E"
                        strokeWidth={isHovered ? 2.5 : 2}
                        className="transition-all duration-150"
                      />
                    )}

                    {/* Transfer Point */}
                    {showTransfer && (
                      <circle
                        cx={x}
                        cy={transferPoints[i].y}
                        r={isHovered ? 5 : 3}
                        fill="#0F172A"
                        stroke="#38BDF8"
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        className="transition-all duration-150"
                      />
                    )}

                    {/* X-Axis Day Labels */}
                    <text
                      x={x}
                      y={height - 10}
                      fill={isHovered ? "#F8FAFC" : "#94A3B8"}
                      fontSize={isHovered ? "11" : "10"}
                      fontWeight={isHovered ? "bold" : "medium"}
                      textAnchor="middle"
                      className="transition-colors duration-150"
                    >
                      {data[i].shortDay}
                    </text>
                    <text
                      x={x}
                      y={height + 2}
                      fill={isHovered ? "#94A3B8" : "#64748B"}
                      fontSize="8.5"
                      textAnchor="middle"
                    >
                      {data[i].date.slice(8, 10)}
                    </text>
                  </g>
                );
              })}

              {/* Invisible Full Height Columns for smooth Mouse Tracking */}
              {data.map((_, i) => {
                const colWidth = chartWidth / data.length;
                const colX = getX(i) - colWidth / 2;
                return (
                  <rect
                    key={`touch-${i}`}
                    x={Math.max(0, colX)}
                    y={0}
                    width={colWidth}
                    height={height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Floating Hover Tooltip */}
          {activePoint && hoveredIndex !== null && (
            <div
              className="absolute z-30 bg-slate-900/95 border border-slate-700/90 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs pointer-events-none transition-all duration-150 min-w-[190px]"
              style={{
                left: `clamp(10px, ${(getX(hoveredIndex) / width) * 100}%, calc(100% - 200px))`,
                top: "10px",
                transform:
                  getX(hoveredIndex) > width / 2
                    ? "translateX(-105%)"
                    : "translateX(5%)",
              }}
            >
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 text-slate-200 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>{activePoint.fullDate}</span>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <ArrowDownLeft className="w-3 h-3" />
                    <span>Income</span>
                  </div>
                  <span className="font-catamaran font-bold">
                    +{formatCurrency(activePoint.income, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-rose-400">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>Expense</span>
                  </div>
                  <span className="font-catamaran font-bold">
                    -{formatCurrency(activePoint.expense, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sky-400">
                  <div className="flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>Transfer</span>
                  </div>
                  <span className="font-catamaran font-bold">
                    {formatCurrency(activePoint.transfer, currency)}
                  </span>
                </div>

                <div className="pt-1.5 mt-1 border-t border-slate-800 flex items-center justify-between font-medium">
                  <span className="text-slate-400">Net Flow</span>
                  <span
                    className={`font-catamaran font-bold ${
                      activePoint.net >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {activePoint.net >= 0 ? "+" : ""}
                    {formatCurrency(activePoint.net, currency)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7-Day Cumulative Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* 7-Day Income */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
              <span>7-Day Income</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="font-catamaran font-bold text-base text-emerald-400">
              +{formatCurrency(totals.income, currency)}
            </div>
          </div>

          {/* 7-Day Expense */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
              <span>7-Day Expense</span>
              <div className="w-2 h-2 rounded-full bg-rose-400" />
            </div>
            <div className="font-catamaran font-bold text-base text-rose-400">
              -{formatCurrency(totals.expense, currency)}
            </div>
          </div>

          {/* 7-Day Transfer */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
              <span>7-Day Transfer</span>
              <div className="w-2 h-2 rounded-full bg-sky-400" />
            </div>
            <div className="font-catamaran font-bold text-base text-sky-400">
              {formatCurrency(totals.transfer, currency)}
            </div>
          </div>

          {/* 7-Day Net Flow */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1">
              <span>7-Day Net Balance</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  totals.net >= 0 ? "bg-blue-400" : "bg-rose-400"
                }`}
              />
            </div>
            <div
              className={`font-catamaran font-bold text-base ${
                totals.net >= 0 ? "text-blue-400" : "text-rose-400"
              }`}
            >
              {totals.net >= 0 ? "+" : ""}
              {formatCurrency(totals.net, currency)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
