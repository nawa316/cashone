"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function seedDemoData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // 1. Seed Accounts
  const demoAccounts = [
    {
      user_id: user.id,
      name: "Chase Premier Checking",
      type: "bank",
      balance: 14250.0,
      currency: "USD",
      color_hex: "#3B82F6",
      icon: "building-2",
    },
    {
      user_id: user.id,
      name: "High-Yield Emergency Fund",
      type: "savings",
      balance: 25500.0,
      currency: "USD",
      color_hex: "#10B981",
      icon: "piggy-bank",
    },
    {
      user_id: user.id,
      name: "Digital Wallet & Apple Pay",
      type: "e_wallet",
      balance: 1850.0,
      currency: "USD",
      color_hex: "#8B5CF6",
      icon: "smartphone",
    },
    {
      user_id: user.id,
      name: "Vanguard S&P 500 Index",
      type: "investment",
      balance: 38000.0,
      currency: "USD",
      color_hex: "#F59E0B",
      icon: "pie-chart",
    },
  ];

  const { data: insertedAccounts, error: accError } = await (supabase as any)
    .from("accounts")
    .insert(demoAccounts)
    .select();

  if (accError) {
    return { success: false, error: `Account seed failed: ${accError.message}` };
  }

  // 2. Seed Categories
  const demoCategories = [
    {
      user_id: user.id,
      name: "Housing & Rent",
      type: "expense",
      icon: "home",
      color_hex: "#DC2626",
    },
    {
      user_id: user.id,
      name: "Food & Dining",
      type: "expense",
      icon: "coffee",
      color_hex: "#EF4444",
    },
    {
      user_id: user.id,
      name: "Tech & Subscriptions",
      type: "expense",
      icon: "laptop",
      color_hex: "#FB7185",
    },
    {
      user_id: user.id,
      name: "Salary & Consulting",
      type: "income",
      icon: "dollar-sign",
      color_hex: "#10B981",
    },
  ];

  const { data: insertedCategories, error: catError } = await (supabase as any)
    .from("categories")
    .insert(demoCategories)
    .select();

  if (catError) {
    return { success: false, error: `Category seed failed: ${catError.message}` };
  }

  const checkingAcc = insertedAccounts?.[0]?.id;
  const savingsAcc = insertedAccounts?.[1]?.id;
  const salaryCat = insertedCategories?.find((c: any) => c.name.includes("Salary"))?.id;
  const foodCat = insertedCategories?.find((c: any) => c.name.includes("Food"))?.id;
  const techCat = insertedCategories?.find((c: any) => c.name.includes("Tech"))?.id;
  const rentCat = insertedCategories?.find((c: any) => c.name.includes("Housing"))?.id;

  // 3. Seed Transactions
  const now = new Date();
  const txDate1 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const txDate2 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
  const txDate3 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
  const txDate4 = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString();

  if (checkingAcc) {
    const demoTransactions: any[] = [
      {
        user_id: user.id,
        account_id: checkingAcc,
        destination_account_id: null,
        category_id: salaryCat || null,
        type: "income",
        amount: 6200.0,
        fee: 0,
        currency: "USD",
        transaction_date: txDate4,
        notes: "Monthly Senior Software Engineer Salary",
      },
      {
        user_id: user.id,
        account_id: checkingAcc,
        category_id: rentCat || null,
        type: "expense",
        amount: 1400.0,
        fee: 0,
        currency: "USD",
        transaction_date: txDate3,
        notes: "Monthly Apartment Lease",
      },
      {
        user_id: user.id,
        account_id: checkingAcc,
        category_id: foodCat || null,
        type: "expense",
        amount: 245.5,
        fee: 0,
        currency: "USD",
        transaction_date: txDate2,
        notes: "Whole Foods Market Grocery Run",
      },
      {
        user_id: user.id,
        account_id: checkingAcc,
        category_id: techCat || null,
        type: "expense",
        amount: 49.99,
        fee: 0,
        currency: "USD",
        transaction_date: txDate1,
        notes: "GitHub Pro & AWS Cloud Compute",
      },
    ];

    if (savingsAcc) {
      demoTransactions.push({
        user_id: user.id,
        account_id: checkingAcc,
        destination_account_id: savingsAcc,
        category_id: null,
        type: "transfer",
        amount: 1000.0,
        fee: 0,
        currency: "USD",
        transaction_date: txDate2,
        notes: "Automated Monthly Savings Accumulation",
      });
    }

    await (supabase as any).from("transactions").insert(demoTransactions);
  }

  // 4. Seed Recurring Plans in User Profile
  if (checkingAcc) {
    const demoRecurring = [
      {
        id: crypto.randomUUID(),
        name: "Apartment Rent",
        type: "expense",
        amount: 1400.0,
        frequency: "monthly",
        account_id: checkingAcc,
        category_id: rentCat || null,
        start_date: new Date().toISOString().slice(0, 10),
        notes: "Automated direct debit for lease",
      },
      {
        id: crypto.randomUUID(),
        name: "Netflix & Cloud Services",
        type: "expense",
        amount: 29.99,
        frequency: "monthly",
        account_id: checkingAcc,
        category_id: techCat || null,
        start_date: new Date().toISOString().slice(0, 10),
        notes: "Digital streaming & storage",
      },
    ];

    await (supabase as any).from("profiles").upsert({
      id: user.id,
      preferences: {
        theme: "dark",
        locale: "en-US",
        recurring_templates: demoRecurring,
      },
      updated_at: new Date().toISOString(),
    });
  }

  revalidatePath("/", "layout");
  return { success: true };
}
