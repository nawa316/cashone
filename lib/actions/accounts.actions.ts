"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateAccountSchema, UpdateAccountSchema } from "@/lib/validations/account.schema";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database.types";

export type Account = Database["public"]["Tables"]["accounts"]["Row"];

export async function getAccounts(): Promise<Account[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
  return (data as Account[]) || [];
}

export async function createAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    balance: parseFloat((formData.get("balance") as string) || "0"),
    currency: (formData.get("currency") as string) || "USD",
    color_hex: (formData.get("color_hex") as string) || "#3B82F6",
    icon: (formData.get("icon") as string) || "wallet",
  };

  const validation = CreateAccountSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid account data",
    };
  }

  const { data, error } = await (supabase as any)
    .from("accounts")
    .insert({
      user_id: user.id,
      name: validation.data.name,
      type: validation.data.type,
      balance: validation.data.balance,
      currency: validation.data.currency,
      color_hex: validation.data.color_hex,
      icon: validation.data.icon,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, data };
}

export async function updateAccount(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    id,
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    balance: parseFloat((formData.get("balance") as string) || "0"),
    currency: (formData.get("currency") as string) || "USD",
    color_hex: (formData.get("color_hex") as string) || "#3B82F6",
    icon: (formData.get("icon") as string) || "wallet",
  };

  const validation = UpdateAccountSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid account data",
    };
  }

  const { error } = await (supabase as any)
    .from("accounts")
    .update({
      name: validation.data.name,
      type: validation.data.type,
      currency: validation.data.currency,
      color_hex: validation.data.color_hex,
      icon: validation.data.icon,
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

export async function deleteAccount(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
