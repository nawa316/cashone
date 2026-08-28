import React from "react";
import { getUserProfile } from "@/lib/actions/profile.actions";
import { getTransactions } from "@/lib/actions/transactions.actions";
import { ProfileForm } from "@/components/settings/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Database,
  Download,
  Lock,
} from "lucide-react";

export default async function SettingsPage() {
  const [profile, transactions] = await Promise.all([
    getUserProfile(),
    getTransactions(),
  ]);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="font-catamaran text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-blue-400" />
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your account profile, default currency, and data export settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile Form */}
        <div className="md:col-span-2">
          <ProfileForm profile={profile} />
        </div>

        {/* Right 1 Col: Security & System Info */}
        <div className="space-y-6">
          {/* Security & RLS Status */}
          <Card className="glass-card">
            <CardHeader className="pb-3 border-b border-slate-800/60">
              <CardTitle className="text-sm font-catamaran font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Security & Isolation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-semibold text-slate-200">PostgreSQL 15+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Row Level Security</span>
                <span className="font-semibold text-emerald-400">Active (Zero-Trust)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Atomic Ledger Sync</span>
                <span className="font-semibold text-blue-400">PL/pgSQL Triggers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Auth Token Auth</span>
                <span className="font-semibold text-slate-200">Secure SSR Cookies</span>
              </div>
            </CardContent>
          </Card>

          {/* Database Summary */}
          <Card className="glass-card">
            <CardHeader className="pb-3 border-b border-slate-800/60">
              <CardTitle className="text-sm font-catamaran font-bold text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                Data Records
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ledger Transactions</span>
                <span className="font-bold text-slate-100 font-catamaran">
                  {transactions.length} Records
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                All receipts and attachments are encrypted and stored in Supabase private buckets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
