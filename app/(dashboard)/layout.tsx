import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { ShortcutsDialog } from "@/components/layout/shortcuts-dialog";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName = "User";
  let userEmail = "user@cashone.app";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";
      userEmail = user.email || "user@cashone.app";
    }
  } catch {
    // Fallback in local/disconnected dev mode
  }

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar userName={userName} userEmail={userEmail} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <CommandPalette />
      <ShortcutsDialog />
    </div>
  );
}
