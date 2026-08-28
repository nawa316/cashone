export interface ParsedImportRow {
  date: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  fee: number;
  notes: string;
}

/**
 * Parses raw CSV string into normalized transaction objects
 */
export function parseCSVTransactions(csvText: string): ParsedImportRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) return [];

  // Parse header line
  const headerLine = lines[0];
  const headers = headerLine
    .split(",")
    .map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());

  const dateIdx = headers.findIndex((h) => h.includes("date") || h.includes("time"));
  const amountIdx = headers.findIndex((h) => h.includes("amount") || h.includes("value") || h.includes("sum"));
  const typeIdx = headers.findIndex((h) => h.includes("type") || h.includes("direction"));
  const notesIdx = headers.findIndex((h) => h.includes("note") || h.includes("desc") || h.includes("memo") || h.includes("payee"));
  const feeIdx = headers.findIndex((h) => h.includes("fee") || h.includes("tax"));

  const results: ParsedImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Match comma separated while preserving quoted strings
    const match = rawLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || rawLine.split(",");
    const cells = match.map((c) => c.replace(/^["']|["']$/g, "").trim());

    const rawDate = dateIdx !== -1 && cells[dateIdx] ? cells[dateIdx] : new Date().toISOString();
    const rawAmount = amountIdx !== -1 && cells[amountIdx] ? parseFloat(cells[amountIdx].replace(/[^0-9.-]+/g, "")) : 0;
    const rawFee = feeIdx !== -1 && cells[feeIdx] ? parseFloat(cells[feeIdx].replace(/[^0-9.-]+/g, "")) : 0;
    const rawNotes = notesIdx !== -1 && cells[notesIdx] ? cells[notesIdx] : "Imported Statement";

    let rawType: "income" | "expense" | "transfer" = "expense";
    if (typeIdx !== -1 && cells[typeIdx]) {
      const t = cells[typeIdx].toLowerCase();
      if (t.includes("inc") || t.includes("cr") || t.includes("deposit")) {
        rawType = "income";
      } else if (t.includes("trans")) {
        rawType = "transfer";
      } else {
        rawType = "expense";
      }
    } else if (rawAmount > 0 && cells[amountIdx]?.includes("+")) {
      rawType = "income";
    }

    if (Math.abs(rawAmount) > 0) {
      results.push({
        date: rawDate,
        type: rawType,
        amount: Math.abs(rawAmount),
        fee: Math.max(rawFee || 0, 0),
        notes: rawNotes,
      });
    }
  }

  return results;
}

/**
 * Parses raw JSON string into normalized transaction objects
 */
export function parseJSONTransactions(jsonText: string): ParsedImportRow[] {
  try {
    const parsed = JSON.parse(jsonText);
    const list: any[] = Array.isArray(parsed)
      ? parsed
      : parsed.transactions && Array.isArray(parsed.transactions)
      ? parsed.transactions
      : [];

    return list
      .map((item) => ({
        date: item.transaction_date || item.date || new Date().toISOString(),
        type: item.type === "income" || item.type === "transfer" ? item.type : "expense",
        amount: Math.abs(Number(item.amount || 0)),
        fee: Math.max(Number(item.fee || 0), 0),
        notes: item.notes || item.description || "Imported Record",
      }))
      .filter((item) => item.amount > 0);
  } catch (e) {
    console.error("JSON parsing error:", e);
    return [];
  }
}
