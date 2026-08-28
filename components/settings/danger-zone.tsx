"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { purgeAllUserData } from "@/lib/actions/danger.actions";
import { AlertTriangle, Trash2, Check, RefreshCw } from "lucide-react";

export function DangerZone() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurge = async () => {
    const confirmation = prompt(
      'Type "PURGE" to confirm clearing all ledger transactions, budgets, and resetting account balances to $0.00:'
    );

    if (confirmation !== "PURGE") {
      if (confirmation !== null) {
        alert('Action canceled. You must type "PURGE" in all uppercase to proceed.');
      }
      return;
    }

    setLoading(true);
    setError(null);
    const result = await purgeAllUserData();
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(result.error || "Failed to purge data");
    }
  };

  return (
    <Card className="glass-card border-rose-900/50 bg-rose-950/10">
      <CardHeader className="pb-3 border-b border-rose-900/40">
        <CardTitle className="text-sm font-catamaran font-bold text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>All transaction data purged and account balances reset to $0.00.</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-200">
              Purge Financial Records & Reset Ledger
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Permanently deletes all transactions, budgets, recurring plans, and resets all account balances to $0.00. Your accounts and auth profile will be preserved.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handlePurge}
            disabled={loading}
            className="text-xs font-semibold flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {loading ? "Purging Records..." : "Purge All Data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
