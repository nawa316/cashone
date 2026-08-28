import type { Transaction } from "@/lib/actions/transactions.actions";

/**
 * Converts a list of transactions into a downloadable CSV string
 */
export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const headers = [
    "Transaction ID",
    "Date",
    "Type",
    "Source Account",
    "Destination Account",
    "Category",
    "Amount",
    "Fee",
    "Currency",
    "Notes",
    "Receipt URL",
  ];

  const rows = transactions.map((tx) => {
    const date = new Date(tx.transaction_date).toISOString().replace("T", " ").slice(0, 19);
    const type = tx.type.toUpperCase();
    const sourceAccount = tx.account?.name ? `"${tx.account.name.replace(/"/g, '""')}"` : "";
    const destAccount = tx.destination_account?.name
      ? `"${tx.destination_account.name.replace(/"/g, '""')}"`
      : "";
    const category = tx.category?.name ? `"${tx.category.name.replace(/"/g, '""')}"` : "";
    const amount = Number(tx.amount || 0).toFixed(2);
    const fee = Number(tx.fee || 0).toFixed(2);
    const currency = tx.currency || "USD";
    const notes = tx.notes ? `"${tx.notes.replace(/"/g, '""')}"` : "";
    const receipt = tx.receipt_url || "";

    return [
      tx.id,
      date,
      type,
      sourceAccount,
      destAccount,
      category,
      amount,
      fee,
      currency,
      notes,
      receipt,
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `cashone_transactions_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports transactions as structured JSON format
 */
export function exportTransactionsToJSON(transactions: Transaction[]): void {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(
      JSON.stringify(
        {
          export_date: new Date().toISOString(),
          app: "Cashone Finance Tracker",
          version: "1.0.0",
          record_count: transactions.length,
          transactions,
        },
        null,
        2
      )
    );

  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute(
    "download",
    `cashone_ledger_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
