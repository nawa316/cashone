"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedDemoData } from "@/lib/actions/seed.actions";
import { Sparkles, Check, AlertCircle } from "lucide-react";

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    if (
      !confirm(
        "Seed realistic demo data? This will generate test accounts, categories, recurring plans, and ledger transactions."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    const result = await seedDemoData();
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(result.error || "Failed to seed demo data");
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Demo financial records seeded successfully!</span>
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleSeed}
        disabled={loading}
        className="w-full text-xs font-semibold hover:border-slate-700"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        {loading ? "Seeding Demo Data..." : "Seed Realistic Demo Data"}
      </Button>
    </div>
  );
}
