"use client";

import React, { useState } from "react";
import { updateProfile, type UserProfile } from "@/lib/actions/profile.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Check, DollarSign } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile | null;
}

const currencies = [
  { code: "USD", name: "US Dollar ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "JPY", name: "Japanese Yen (¥)" },
  { code: "IDR", name: "Indonesian Rupiah (Rp)" },
  { code: "SGD", name: "Singapore Dollar (S$)" },
  { code: "CAD", name: "Canadian Dollar (C$)" },
  { code: "AUD", name: "Australian Dollar (A$)" },
];

export function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setLoading(false);
    if (!result.success) {
      setError(result.error || "Failed to update profile");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4 border-b border-slate-800/60">
        <CardTitle className="text-base font-catamaran font-bold text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          Personal Profile & Preferences
        </CardTitle>
        <p className="text-xs text-slate-400">
          Configure your personal details and primary reporting currency
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {saved && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              Profile and preferences updated successfully!
            </div>
          )}

          {/* Email (Read-only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Account Email
            </label>
            <Input
              value={profile?.email || ""}
              disabled
              className="bg-slate-900/40 text-slate-400 cursor-not-allowed border-slate-800"
            />
            <span className="text-[10px] text-slate-500">
              Email is managed by Supabase Authentication.
            </span>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Display Name
            </label>
            <Input
              name="full_name"
              defaultValue={profile?.full_name || ""}
              placeholder="e.g. Satoshi Nakamoto"
              required
            />
          </div>

          {/* Default Currency Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Default Reporting Currency
            </label>
            <select
              name="default_currency"
              defaultValue={profile?.default_currency || "USD"}
              className="w-full h-10 px-3 rounded-md bg-slate-950/60 border border-slate-800 text-slate-100 text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900">
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500">
              Applied as the standard currency representation on metrics and exports.
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="font-semibold text-xs min-w-[120px]"
            >
              {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
