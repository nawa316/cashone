export interface DailyTrendPoint {
  date: string; // "YYYY-MM-DD"
  dayLabel: string; // e.g. "Mon 24"
  shortDay: string; // e.g. "Mon"
  fullDate: string; // e.g. "Mon, Aug 24, 2026"
  income: number;
  expense: number;
  transfer: number;
  net: number;
}

export function getWeeklyTrendData(
  transactions: {
    transaction_date: string;
    type: string;
    amount: number | string;
    fee?: number | string | null;
  }[]
): DailyTrendPoint[] {
  const result: DailyTrendPoint[] = [];
  const now = new Date();

  // Generate 7 days from 6 days ago up to today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const shortDay = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayLabel = `${shortDay} ${d.getDate()}`;
    const fullDate = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    result.push({
      date: dateKey,
      dayLabel,
      shortDay,
      fullDate,
      income: 0,
      expense: 0,
      transfer: 0,
      net: 0,
    });
  }

  // Aggregate transactions by date
  transactions.forEach((tx) => {
    if (!tx.transaction_date) return;
    const txDate = new Date(tx.transaction_date);
    if (isNaN(txDate.getTime())) return;

    const year = txDate.getFullYear();
    const month = String(txDate.getMonth() + 1).padStart(2, "0");
    const day = String(txDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const targetDay = result.find((d) => d.date === dateKey);
    if (!targetDay) return;

    const amount = Number(tx.amount || 0);
    const fee = Number(tx.fee || 0);

    if (tx.type === "income") {
      targetDay.income += amount;
      targetDay.net += amount;
    } else if (tx.type === "expense") {
      const totalExp = amount + fee;
      targetDay.expense += totalExp;
      targetDay.net -= totalExp;
    } else if (tx.type === "transfer") {
      targetDay.transfer += amount;
    }
  });

  return result;
}
