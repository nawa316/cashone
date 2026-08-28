"use server";

import { createClient } from "@/lib/supabase/server";
import { TransactionFormSchema } from "@/lib/validations/transaction.schema";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database.types";

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  account?: {
    id: string;
    name: string;
    type: string;
    currency: string;
    color_hex: string;
  } | null;
  destination_account?: {
    id: string;
    name: string;
    type: string;
    currency: string;
    color_hex: string;
  } | null;
  category?: {
    id: string;
    name: string;
    type: string;
    icon: string;
    color_hex: string;
  } | null;
};

export async function getTransactions(options?: {
  accountId?: string;
  type?: string;
  limit?: number;
}): Promise<Transaction[]> {
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select(`
      *,
      account:accounts!transactions_account_id_fkey(id, name, type, currency, color_hex),
      destination_account:accounts!transactions_destination_account_id_fkey(id, name, type, currency, color_hex),
      category:categories(id, name, type, icon, color_hex)
    `)
    .order("transaction_date", { ascending: false });

  if (options?.accountId) {
    query = query.or(`account_id.eq.${options.accountId},destination_account_id.eq.${options.accountId}`);
  }

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
  return (data as unknown as Transaction[]) || [];
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const type = formData.get("type") as string;
  const rawData = {
    account_id: formData.get("account_id") as string,
    destination_account_id:
      type === "transfer" ? (formData.get("destination_account_id") as string) : null,
    category_id:
      type !== "transfer" && formData.get("category_id")
        ? (formData.get("category_id") as string)
        : null,
    type,
    amount: parseFloat((formData.get("amount") as string) || "0"),
    fee: parseFloat((formData.get("fee") as string) || "0"),
    currency: (formData.get("currency") as string) || "USD",
    transaction_date:
      (formData.get("transaction_date") as string) || new Date().toISOString(),
    notes: (formData.get("notes") as string) || null,
    receipt_url: (formData.get("receipt_url") as string) || null,
  };

  const validation = TransactionFormSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid transaction data",
    };
  }

  const { data, error } = await (supabase as any)
    .from("transactions")
    .insert({
      user_id: user.id,
      account_id: validation.data.account_id,
      destination_account_id: validation.data.destination_account_id || null,
      category_id: validation.data.category_id || null,
      type: validation.data.type,
      amount: validation.data.amount,
      fee: validation.data.fee,
      currency: validation.data.currency,
      transaction_date: validation.data.transaction_date,
      notes: validation.data.notes || null,
      receipt_url: validation.data.receipt_url || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, data };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
