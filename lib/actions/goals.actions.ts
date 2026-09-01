"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateGoalSchema, UpdateGoalSchema } from "@/lib/validations/goal.schema";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database.types";

export type SavingGoal = Database["public"]["Tables"]["saving_goals"]["Row"];

export async function getGoals(): Promise<SavingGoal[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from("saving_goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching goals:", error);
    return [];
  }
  return (data as SavingGoal[]) || [];
}

export async function createGoal(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await (supabase as any).auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name") as string,
    account_id: formData.get("account_id") as string,
    target_amount: parseFloat((formData.get("target_amount") as string) || "0"),
    target_date: formData.get("target_date") as string || null,
    color_hex: (formData.get("color_hex") as string) || "#10B981",
    icon: (formData.get("icon") as string) || "target",
  };

  const validation = CreateGoalSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid goal data",
    };
  }

  const { error } = await (supabase as any).from("saving_goals").insert({
    ...validation.data,
    user_id: user.id,
  });

  if (error) {
    console.error("Create goal error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/goals");
  return { success: true };
}

export async function updateGoal(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await (supabase as any).auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name") as string,
    account_id: formData.get("account_id") as string,
    target_amount: parseFloat((formData.get("target_amount") as string) || "0"),
    target_date: formData.get("target_date") as string || null,
    color_hex: formData.get("color_hex") as string,
    icon: formData.get("icon") as string,
  };

  const validation = UpdateGoalSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid goal data",
    };
  }

  const { error } = await (supabase as any)
    .from("saving_goals")
    .update(validation.data)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/goals");
  return { success: true };
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await (supabase as any).auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await (supabase as any)
    .from("saving_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/goals");
  return { success: true };
}
