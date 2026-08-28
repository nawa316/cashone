import React from "react";
import Link from "next/link";
import { TrendingUp, ShieldCheck, ArrowLeftRight } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0B0F19]">
      {/* Left Branding / Hero (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0F172A] to-[#0B0F19] border-r border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-catamaran text-2xl font-bold tracking-tight text-white">
                Cash<span className="text-blue-500">one</span>
              </span>
              <span className="block text-xs font-medium text-slate-400">
                Personal Finance Tracker
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="space-y-2">
            <h2 className="font-catamaran text-3xl font-bold text-slate-100 leading-tight">
              Master Your Cash Flow with Double-Entry Precision.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Consolidate multi-currency bank accounts, high-yield savings, and digital e-wallets with atomic balance sync and automated category analytics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800/60 text-emerald-400 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Zero-Trust RLS</h4>
                <p className="text-[11px] text-slate-500">End-to-end user isolation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-800/60 text-blue-400 mt-0.5">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Atomic Sync</h4>
                <p className="text-[11px] text-slate-500">Inter-account transfers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-600">
          © {new Date().getFullYear()} Cashone. Built for precision personal finance tracking.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
