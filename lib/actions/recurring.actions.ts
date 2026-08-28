"use server";

import { createClient } from "@/lib/supabase/server";
import { RecurringFormSchema } from "@/lib/validations/recurring.schema";
import { createTransaction } from "@/lib/actions/transactions.actions";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { getCategories } from "@/lib/actions/categories.actions";
import { revalidatePath } from "next/cache";

export interface RecurringTemplate {
  id: string;
  name: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  account_id: string;
  destination_account_id?: string | null;
  category_id?: string | null;
  start_date: string;
  notes?: string | null;
  last_executed_at?: string | null;
  account?: any;
  destination_account?: any;
  category?: any;
}

export async function getRecurringTemplates(): Promise<RecurringTemplate[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const [{ data: profile }, accounts, categories] = await Promise.all([
    (supabase as any).from("profiles").select("preferences").eq("id", user.id).single(),
    getAccounts(),
    getCategories(),
  ]);

  const preferences = (profile?.preferences as any) || {};
  const templates: RecurringTemplate[] = preferences.recurring_templates || [];

  return templates.map((tmpl) => {
    const acc = accounts.find((a) => a.id === tmpl.account_id);
    const destAcc = tmpl.destination_account_id
      ? accounts.find((a) => a.id === tmpl.destination_account_id)
      : null;
    const cat = tmpl.category_id
      ? categories.find((c) => c.id === tmpl.category_id)
      : null;

    return {
      ...tmpl,
      account: acc,
      destination_account: destAcc,
      category: cat,
    };
  });
}

export async function createRecurringTemplate(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name") as string,
    type: formData.get("type") as "income" | "expense" | "transfer",
    amount: parseFloat((formData.get("amount") as string) || "0"),
    frequency: (formData.get("frequency") as any) || "monthly",
    account_id: formData.get("account_id") as string,
    destination_account_id:
      formData.get("destination_account_id") ? (formData.get("destination_account_id") as string) : null,
    category_id: formData.get("category_id") ? (formData.get("category_id") as string) : null,
    start_date: (formData.get("start_date") as string) || new Date().toISOString().slice(0, 10),
    notes: (formData.get("notes") as string) || null,
  };

  const validation = RecurringFormSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid recurring template data",
    };
  }

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  const preferences = (profile?.preferences as any) || {};
  const currentList: RecurringTemplate[] = preferences.recurring_templates || [];

  const newTemplate: RecurringTemplate = {
    id: crypto.randomUUID(),
    ...validation.data,
    last_executed_at: null,
  };

  const updatedTemplates = [newTemplate, ...currentList];

  const { error } = await (supabase as any)
    .from("profiles")
    .upsert({
      id: user.id,
      preferences: {
        ...preferences,
        recurring_templates: updatedTemplates,
      },
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteRecurringTemplate(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  const preferences = (profile?.preferences as any) || {};
  const currentList: RecurringTemplate[] = preferences.recurring_templates || [];
  const updatedList = currentList.filter((t) => t.id !== id);

  const { error } = await (supabase as any)
    .from("profiles")
    .upsert({
      id: user.id,
      preferences: {
        ...preferences,
        recurring_templates: updatedList,
      },
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function executeRecurringTemplate(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  const preferences = (profile?.preferences as any) || {};
  const currentList: RecurringTemplate[] = preferences.recurring_templates || [];
  const template = currentList.find((t) => t.id === id);

  if (!template) {
    return { success: false, error: "Recurring template not found" };
  }

  // Create form data to execute transaction
  const formData = new FormData();
  formData.append("type", template.type);
  formData.append("amount", template.amount.toString());
  formData.append("fee", "0");
  formData.append("account_id", template.account_id);
  if (template.destination_account_id) {
    formData.append("destination_account_id", template.destination_account_id);
  }
  if (template.category_id) {
    formData.append("category_id", template.category_id);
  }
  formData.append("notes", `[Recurring: ${template.name}] ${template.notes || ""}`.trim());
  formData.append("transaction_date", new Date().toISOString());

  const txResult = await createTransaction(formData);
  if (!txResult.success) {
    return { success: false, error: txResult.error };
  }

  // Update last executed timestamp
  const updatedList = currentList.map((t) =>
    t.id === id ? { ...t, last_executed_at: new Date().toISOString() } : t
  );

  await (supabase as any).from("profiles").upsert({
    id: user.id,
    preferences: {
      ...preferences,
      recurring_templates: updatedList,
    },
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  return { success: true };
}
