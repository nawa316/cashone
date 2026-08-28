"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkDatabaseHealth(): Promise<{
  status: "healthy" | "degraded" | "disconnected";
  latencyMs: number;
  engine: string;
}> {
  const start = Date.now();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("categories").select("id").limit(1);

    const latencyMs = Date.now() - start;

    if (error) {
      return {
        status: "degraded",
        latencyMs,
        engine: "PostgreSQL (Restricted)",
      };
    }

    return {
      status: "healthy",
      latencyMs,
      engine: "PostgreSQL 15+ (Online)",
    };
  } catch {
    return {
      status: "disconnected",
      latencyMs: 0,
      engine: "Offline Mode",
    };
  }
}
