"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadReceipt(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("receipts")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("receipts")
    .getPublicUrl(fileName);

  return { success: true, url: publicUrlData.publicUrl };
}
