"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { parseCSVTransactions, parseJSONTransactions, type ParsedImportRow } from "@/lib/utils/import";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { UploadCloud, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: any[];
}

export function ImportDialog({
  open,
  onOpenChange,
  accounts = [],
}: ImportDialogProps) {
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedImportRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith(".json")) {
        const rows = parseJSONTransactions(content);
        setParsedRows(rows);
      } else {
        const rows = parseCSVTransactions(content);
        setParsedRows(rows);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file");
    };

    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (!selectedAccountId) {
      setError("Please choose a destination account for the imported records");
      return;
    }

    if (parsedRows.length === 0) {
      setError("No transaction records found in file");
      return;
    }

    setImporting(true);
    setProgress({ current: 0, total: parsedRows.length });

    let importedCount = 0;

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      const formData = new FormData();
      formData.append("type", row.type);
      formData.append("amount", row.amount.toString());
      formData.append("fee", row.fee.toString());
      formData.append("account_id", selectedAccountId);
      formData.append("transaction_date", row.date);
      formData.append("notes", `[Imported] ${row.notes}`.trim());

      await createTransaction(formData);
      importedCount++;
      setProgress({ current: importedCount, total: parsedRows.length });
    }

    setImporting(false);
    setParsedRows([]);
    setFileName(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-catamaran text-lg text-slate-100">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            Import Statements & Bank Records
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Account Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Target Financial Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Account for statement import</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-slate-900">
                  {acc.name} ({acc.currency})
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-slate-700 transition-colors relative bg-slate-900/30">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileSpreadsheet className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-semibold text-slate-200">
              {fileName ? fileName : "Click or drag CSV / JSON statement file here"}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Supports CSV with standard Date, Amount, Type, and Notes headers.
            </p>
          </div>

          {/* Parsed Rows Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Detected {parsedRows.length} Transaction Records
                </span>
                <span className="text-[10px] text-slate-500">Previewing top 4</span>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5 rounded-lg border border-slate-800 p-2 bg-slate-950/40">
                {parsedRows.slice(0, 4).map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-[11px] p-2 rounded bg-slate-900/60 border border-slate-800/60"
                  >
                    <div className="truncate max-w-[240px]">
                      <span className="font-medium text-slate-200 block truncate">
                        {row.notes}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {row.date.slice(0, 10)} • {row.type}
                      </span>
                    </div>
                    <span
                      className={`font-catamaran font-bold ${
                        row.type === "income" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {row.type === "income" ? "+" : "-"}
                      {formatCurrency(row.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {importing && progress && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Importing transactions...</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{
                    width: `${Math.round((progress.current / progress.total) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExecuteImport}
              disabled={importing || parsedRows.length === 0 || !selectedAccountId}
            >
              {importing ? "Importing Records..." : `Import ${parsedRows.length} Transactions`}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
