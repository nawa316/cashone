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

// 4. CSV Parser Logic
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
