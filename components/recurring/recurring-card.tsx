"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  executeRecurringTemplate,
  deleteRecurringTemplate,
  type RecurringTemplate,
} from "@/lib/actions/recurring.actions";
import { formatCurrency } from "@/lib/utils";
import {
  Repeat,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Play,
  Trash2,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface RecurringCardProps {
  template: RecurringTemplate;
}

export function RecurringCard({ template }: RecurringCardProps) {
  const [executing, setExecuting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExecute = async () => {
    setExecuting(true);
    const res = await executeRecurringTemplate(template.id);
    setExecuting(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return;
    setDeleting(true);
    await deleteRecurringTemplate(template.id);
    setDeleting(false);
  };

  const isIncome = template.type === "income";
  const isTransfer = template.type === "transfer";

  return (
    <Card className="glass-card hover:border-slate-700/80 transition-all">
      <CardContent className="p-5 space-y-4">
        {/* Top Header: Frequency badge & Delete */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                isIncome
                  ? "bg-emerald-500/15 text-emerald-400"
                  : isTransfer
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-rose-500/15 text-rose-400"
              }`}
            >
              {isIncome ? (
                <ArrowDownLeft className="w-4 h-4" />
              ) : isTransfer ? (
                <ArrowLeftRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-catamaran font-bold text-sm text-slate-100">
                {template.name}
              </h3>
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                {template.frequency} schedule
              </span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete schedule"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Amount & Account details */}
        <div className="flex items-baseline justify-between border-t border-b border-slate-800/60 py-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              Scheduled Flow
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {isTransfer
                ? `${template.account?.name || "Source"} → ${template.destination_account?.name || "Dest"}`
                : `${template.account?.name || "Account"} ${template.category ? `• ${template.category.name}` : ""}`}
            </span>
          </div>

          <div
            className={`font-catamaran font-bold text-lg ${
              isIncome
                ? "text-emerald-400"
                : isTransfer
                ? "text-blue-400"
                : "text-rose-400"
            }`}
          >
            {isIncome ? "+" : isTransfer ? "" : "-"}
            {formatCurrency(template.amount, template.account?.currency || (template as any).currency || "USD")}
          </div>
        </div>

        {/* Execution Actions & Timestamp */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {template.last_executed_at
                ? `Last: ${new Date(template.last_executed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : `Starts: ${template.start_date}`}
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleExecute}
            disabled={executing}
            className={`text-xs h-8 font-semibold ${
              success
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
            }`}
          >
            {success ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Posted!
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Post Now
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
