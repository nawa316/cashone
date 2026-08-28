"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateCategorySchema } from "@/lib/validations/category.schema";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database.types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

export async function getCategories(type?: "income" | "expense"): Promise<Category[]> {
  const supabase = await createClient();
  let query = supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return (data as Category[]) || [];
}

export async function createCategory(formData: FormData) {
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
    icon: (formData.get("icon") as string) || "tag",
    color_hex: (formData.get("color_hex") as string) || "#10B981",
    parent_id: (formData.get("parent_id") as string) || null,
  };

  const validation = CreateCategorySchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid category data",
    };
  }

  const { data, error } = await (supabase as any)
    .from("categories")
    .insert({
      user_id: user.id,
      is_system: false,
      name: validation.data.name,
      type: validation.data.type,
      icon: validation.data.icon,
      color_hex: validation.data.color_hex,
      parent_id: validation.data.parent_id || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, data };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("is_system", false);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
