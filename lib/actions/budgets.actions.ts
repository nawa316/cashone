"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateBudgetSchema, UpdateBudgetSchema } from "@/lib/validations/budget.schema";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database.types";

export type Budget = Database["public"]["Tables"]["budgets"]["Row"] & {
  category?: {
    id: string;
    name: string;
    icon: string;
    color_hex: string;
  } | null;
  spent?: number;
  percentage?: number;
  remaining?: number;
  isOverBudget?: boolean;
};

export async function getBudgets(): Promise<Budget[]> {
  const supabase = await createClient();

  // 1. Fetch budgets with categories
  const { data: budgets, error } = await (supabase as any)
    .from("budgets")
    .select(`
      *,
      category:categories(id, name, icon, color_hex)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }

  if (!budgets || budgets.length === 0) return [];

  // 2. Fetch all expenses to compute actual spending per category in the current period
  const { data: expenses } = await (supabase as any)
    .from("transactions")
    .select("amount, fee, category_id, transaction_date")
    .eq("type", "expense");

  const allExpenses = (expenses as Array<{
    amount: number;
    fee: number;
    category_id: string;
    transaction_date: string;
  }>) || [];

  return (budgets as any[]).map((b) => {
    // Filter expenses within this budget's category and date range
    const categoryExpenses = allExpenses.filter((e) => {
      if (e.category_id !== b.category_id) return false;
      const txDate = e.transaction_date.slice(0, 10);
      return txDate >= b.start_date && txDate <= b.end_date;
    });

    const totalSpent = categoryExpenses.reduce(
      (sum: number, e) => sum + Number(e.amount || 0) + Number(e.fee || 0),
      0
    );

    const limit = Number(b.limit_amount) || 1;
    const percentage = Math.min(Math.round((totalSpent / limit) * 100), 999);
    const remaining = Math.max(limit - totalSpent, 0);
    const isOverBudget = totalSpent > limit;

    return {
      ...b,
      spent: totalSpent,
      percentage,
      remaining,
      isOverBudget,
    };
  });
}

export async function createBudget(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    category_id: formData.get("category_id") as string,
    limit_amount: parseFloat((formData.get("limit_amount") as string) || "0"),
    period: (formData.get("period") as string) || "monthly",
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
  };

  const validation = CreateBudgetSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid budget data",
    };
  }

  const { data, error } = await (supabase as any)
    .from("budgets")
    .insert({
      user_id: user.id,
      category_id: validation.data.category_id,
      limit_amount: validation.data.limit_amount,
      period: validation.data.period,
      start_date: validation.data.start_date,
      end_date: validation.data.end_date,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, data };
}

export async function updateBudget(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    id,
    limit_amount: parseFloat((formData.get("limit_amount") as string) || "0"),
    period: formData.get("period") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
  };

  const validation = UpdateBudgetSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid budget data",
    };
  }

  const { error } = await (supabase as any)
    .from("budgets")
    .update({
      limit_amount: validation.data.limit_amount,
      period: validation.data.period,
      start_date: validation.data.start_date,
      end_date: validation.data.end_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteBudget(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await (supabase as any)
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
