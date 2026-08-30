import test from "node:test";
import assert from "node:assert/strict";

// 1. Double-Entry Math Simulation
function simulateDoubleEntryTransfer({
  sourceBalance,
  destBalance,
  amount,
  fee = 0,
}) {
  const newSource = sourceBalance - (amount + fee);
  const newDest = destBalance + amount;
  const netDelta = newSource + newDest - (sourceBalance + destBalance);
  return { newSource, newDest, netDelta };
}

// 2. Budget Health & Threshold Calculator
function calculateBudgetStatus(spent, limit) {
  const percentage = Math.round((spent / limit) * 100);
  const remaining = Math.max(limit - spent, 0);
  const isOverBudget = spent > limit;
  const isWarning = percentage >= 80 && !isOverBudget;
  return { percentage, remaining, isOverBudget, isWarning };
}

// 3. Cashflow Savings Rate Calculator
function calculateSavingsRate(income, expense) {
  const netSavings = income - expense;
  const rate = income > 0 ? ((netSavings / income) * 100).toFixed(1) : "0.0";
  return { netSavings, rate: parseFloat(rate) };
}

// 4. Multi-Currency FX Engine Simulation
const RATES_TO_USD = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.28,
  IDR: 0.0000625,
};

function convertCurrency(amount, from, to) {
  if (from === to) return amount;
  const fromRate = RATES_TO_USD[from] || 1.0;
  const toRate = RATES_TO_USD[to] || 1.0;
  return (amount * fromRate) / toRate;
}

// 5. CSV Parser Logic
function parseSimpleCSV(csvText) {
  const lines = csvText.trim().split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const [date, type, amount, fee, notes] = lines[i].split(",").map((s) => s.trim());
    rows.push({
      date,
      type,
      amount: parseFloat(amount || "0"),
      fee: parseFloat(fee || "0"),
      notes,
    });
  }
  return rows;
}

// --- TEST SUITES ---

test("Double-Entry Transfer Math preserves balance minus transaction fees", () => {
  const result = simulateDoubleEntryTransfer({
    sourceBalance: 5000,
    destBalance: 1000,
    amount: 1500,
    fee: 25,
  });

  assert.equal(result.newSource, 3475, "Source balance must deduct amount + fee");
  assert.equal(result.newDest, 2500, "Destination balance must increase by exact transfer amount");
  assert.equal(result.netDelta, -25, "System balance variance must match the negative fee");
});

test("Double-Entry Transfer with 0 fee has zero systemic variance", () => {
  const result = simulateDoubleEntryTransfer({
    sourceBalance: 10000,
    destBalance: 2000,
    amount: 3000,
    fee: 0,
  });

  assert.equal(result.newSource, 7000);
  assert.equal(result.newDest, 5000);
  assert.equal(result.netDelta, 0);
});

test("Budget status properly flags normal, warning (>=80%), and overbudget (>100%)", () => {
  // Safe (< 80%)
  const safe = calculateBudgetStatus(500, 1000);
  assert.equal(safe.percentage, 50);
  assert.equal(safe.remaining, 500);
  assert.equal(safe.isWarning, false);
  assert.equal(safe.isOverBudget, false);

  // Warning (85%)
  const warning = calculateBudgetStatus(850, 1000);
  assert.equal(warning.percentage, 85);
  assert.equal(warning.remaining, 150);
  assert.equal(warning.isWarning, true);
  assert.equal(warning.isOverBudget, false);

  // Overbudget (120%)
  const over = calculateBudgetStatus(1200, 1000);
  assert.equal(over.percentage, 120);
  assert.equal(over.remaining, 0);
  assert.equal(over.isWarning, false);
  assert.equal(over.isOverBudget, true);
});

test("Savings Rate accurately computes net surplus and percentage", () => {
  const result = calculateSavingsRate(5000, 2000);
  assert.equal(result.netSavings, 3000);
  assert.equal(result.rate, 60.0);

  const deficit = calculateSavingsRate(2000, 2500);
  assert.equal(deficit.netSavings, -500);
  assert.equal(deficit.rate, -25.0);

  const zeroIncome = calculateSavingsRate(0, 500);
  assert.equal(zeroIncome.netSavings, -500);
  assert.equal(zeroIncome.rate, 0);
});

test("Multi-Currency FX Engine correctly normalizes foreign balances", () => {
  // 100 EUR to USD (1.08 rate)
  const eurToUsd = convertCurrency(100, "EUR", "USD");
  assert.equal(eurToUsd, 108);

  // 160,000 IDR to USD (~$10)
  const idrToUsd = convertCurrency(160000, "IDR", "USD");
  assert.equal(idrToUsd, 10);

  // Same currency identity
  const usdToUsd = convertCurrency(500, "USD", "USD");
  assert.equal(usdToUsd, 500);
});

test("CSV Statement Parser properly extracts rows and amounts", () => {
  const csv = `Date,Type,Amount,Fee,Notes
2026-08-01,income,4500,0,Salary
2026-08-05,expense,150,5,Groceries
2026-08-10,transfer,500,0,Savings Transfer`;

  const parsed = parseSimpleCSV(csv);
  assert.equal(parsed.length, 3);
  assert.equal(parsed[0].type, "income");
  assert.equal(parsed[0].amount, 4500);
  assert.equal(parsed[1].type, "expense");
  assert.equal(parsed[1].amount, 150);
  assert.equal(parsed[1].fee, 5);
  assert.equal(parsed[2].type, "transfer");
  assert.equal(parsed[2].amount, 500);
});

// 6. 7-Day Weekly Trend Data Aggregator Simulation
function aggregateWeeklyTrends(transactions, baseDate = new Date()) {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    result.push({
      date: dateKey,
      income: 0,
      expense: 0,
      transfer: 0,
      net: 0,
    });
  }

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

test("7-Day Weekly Trend correctly aggregates Income, Expense, and Transfer buckets", () => {
  const baseDate = new Date("2026-08-30T12:00:00Z");
  const testTransactions = [
    // Today: Aug 30
    { transaction_date: "2026-08-30T09:00:00Z", type: "income", amount: 1200, fee: 0 },
    { transaction_date: "2026-08-30T10:00:00Z", type: "expense", amount: 150, fee: 10 },
    { transaction_date: "2026-08-30T11:00:00Z", type: "transfer", amount: 300, fee: 0 },
    // 2 days ago: Aug 28
    { transaction_date: "2026-08-28T08:00:00Z", type: "income", amount: 500, fee: 0 },
    { transaction_date: "2026-08-28T14:00:00Z", type: "expense", amount: 200, fee: 5 },
    // 6 days ago: Aug 24
    { transaction_date: "2026-08-24T12:00:00Z", type: "transfer", amount: 450, fee: 0 },
    // Outside 7-day window (8 days ago: Aug 22) - should NOT be included
    { transaction_date: "2026-08-22T12:00:00Z", type: "income", amount: 9999, fee: 0 },
  ];

  const trend = aggregateWeeklyTrends(testTransactions, baseDate);
  assert.equal(trend.length, 7, "Must contain exactly 7 consecutive days");

  // Today (2026-08-30)
  const today = trend[6];
  assert.equal(today.date, "2026-08-30");
  assert.equal(today.income, 1200);
  assert.equal(today.expense, 160); // 150 + 10 fee
  assert.equal(today.transfer, 300);
  assert.equal(today.net, 1040); // 1200 - 160

  // 2 days ago (2026-08-28)
  const twoDaysAgo = trend[4];
  assert.equal(twoDaysAgo.date, "2026-08-28");
  assert.equal(twoDaysAgo.income, 500);
  assert.equal(twoDaysAgo.expense, 205); // 200 + 5 fee
  assert.equal(twoDaysAgo.net, 295);

  // 6 days ago (2026-08-24)
  const sixDaysAgo = trend[0];
  assert.equal(sixDaysAgo.date, "2026-08-24");
  assert.equal(sixDaysAgo.transfer, 450);
  assert.equal(sixDaysAgo.income, 0);
  assert.equal(sixDaysAgo.expense, 0);

  // Overall totals across the 7 days (ignoring Aug 22)
  const totalIncome = trend.reduce((sum, d) => sum + d.income, 0);
  assert.equal(totalIncome, 1700, "Should only include 1200 + 500 = 1700");
});

