"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string | null;
  avatar_url: string | null;
  default_currency: string;
  preferences: {
    theme?: string;
    locale?: string;
  };
  created_at: string;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    // If profile doesn't exist yet, return fallback with auth user data
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || "Account Owner",
      avatar_url: user.user_metadata?.avatar_url || null,
      default_currency: "USD",
      preferences: { theme: "dark", locale: "en-US" },
      created_at: user.created_at || new Date().toISOString(),
    };
  }

  return {
    ...(profile as any),
    email: user.email,
  };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const fullName = (formData.get("full_name") as string)?.trim();
  const defaultCurrency =
    (formData.get("default_currency") as string)?.trim()?.toUpperCase() || "USD";

  if (!fullName) {
    return { success: false, error: "Full name is required" };
  }

  const { error } = await (supabase as any)
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      default_currency: defaultCurrency,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
