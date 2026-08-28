"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RecurringDialog } from "@/components/recurring/recurring-dialog";
import { Repeat, Plus } from "lucide-react";

interface RecurringHeaderProps {
  accounts: any[];
  categories: any[];
}

export function RecurringHeader({
  accounts = [],
  categories = [],
}: RecurringHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-catamaran text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Repeat className="w-6 h-6 text-blue-400" />
            Recurring & Scheduled Bills
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automate routine salaries, recurring subscriptions, and scheduled monthly bills.
          </p>
        </div>

        <div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="font-semibold text-xs shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            New Recurring Plan
          </Button>
        </div>
      </div>

      <RecurringDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accounts={accounts}
        categories={categories}
      />
    </>
  );
}
