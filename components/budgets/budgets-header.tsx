"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BudgetDialog } from "@/components/budgets/budget-dialog";
import { Plus, PiggyBank } from "lucide-react";

interface BudgetsHeaderProps {
  categories: any[];
}

export function BudgetsHeader({ categories = [] }: BudgetsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-catamaran text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <PiggyBank className="w-6 h-6 text-emerald-400" />
            Budget Limits & Planning
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Set spending targets per category and monitor real-time progress against actual ledger outlays.
          </p>
        </div>

        <div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="font-semibold text-xs shadow-lg shadow-emerald-500/20"
            variant="profit"
          >
            <Plus className="w-4 h-4" />
            Set Budget Limit
          </Button>
        </div>
      </div>

      <BudgetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
      />
    </>
  );
}
