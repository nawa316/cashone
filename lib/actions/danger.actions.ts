"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function purgeAllUserData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // 1. Delete all transactions
  await supabase.from("transactions").delete().eq("user_id", user.id);

  // 2. Delete all budgets
  await supabase.from("budgets").delete().eq("user_id", user.id);

  // 3. Reset account balances to 0
  await (supabase as any)
    .from("accounts")
    .update({ balance: 0, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  // 4. Reset profile recurring templates
  await (supabase as any)
    .from("profiles")
    .update({
      preferences: { theme: "dark", locale: "en-US", recurring_templates: [] },
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  revalidatePath("/", "layout");
  return { success: true };
}
