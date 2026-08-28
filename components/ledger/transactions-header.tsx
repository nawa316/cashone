"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionFormDialog } from "@/components/ledger/transaction-form-dialog";
import { ImportDialog } from "@/components/ledger/import-dialog";
import { Plus, ArrowLeftRight, FileSpreadsheet, FileCode, UploadCloud } from "lucide-react";
import {
  exportTransactionsToCSV,
  exportTransactionsToJSON,
} from "@/lib/utils/export";
import type { Transaction } from "@/lib/actions/transactions.actions";

interface TransactionsHeaderProps {
  accounts: any[];
  categories: any[];
  transactions?: Transaction[];
}

export function TransactionsHeader({
  accounts = [],
  categories = [],
  transactions = [],
}: TransactionsHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-catamaran text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-blue-400" />
            Transaction Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time ledger with atomic double-entry balance updates and receipt storage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="text-xs"
            onClick={() => setImportDialogOpen(true)}
            title="Import Bank Statements (CSV/JSON)"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Import
          </Button>

          {transactions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="secondary"
                className="text-xs"
                onClick={() => exportTransactionsToCSV(transactions)}
                title="Export CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                CSV
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="text-xs"
                onClick={() => exportTransactionsToJSON(transactions)}
                title="Export JSON"
              >
                <FileCode className="w-3.5 h-3.5" />
                JSON
              </Button>
            </div>
          )}

          <Button
            onClick={() => setDialogOpen(true)}
            className="font-semibold text-xs shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Record Transaction
          </Button>
        </div>
      </div>

      <TransactionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accounts={accounts}
        categories={categories}
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        accounts={accounts}
      />
    </>
  );
}
