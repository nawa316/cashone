"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth.actions";
import {
  Menu,
  X,
  Search,
  Plus,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  Repeat,
  BarChart3,
  Tags,
  Settings,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mobileNavItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Accounts & Wallets", href: "/accounts", icon: Wallet },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Budgets & Limits", href: "/budgets", icon: PiggyBank },
  { name: "Recurring & Bills", href: "/recurring", icon: Repeat },
  { name: "Analytics & Reports", href: "/analytics", icon: BarChart3 },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Saving Goals", href: "/goals", icon: Target },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navbar({
  userName = "User",
  userEmail = "user@cashone.app",
}: {
  userName?: string;
  userEmail?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Hamburger & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Global Search Bar (Triggers Command Palette) */}
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("open-command-palette"));
            }
          }}
          className="hidden sm:flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 text-xs w-64 hover:border-slate-700 hover:text-slate-200 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Search command or pages...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-3">
        <Link href="/transactions">
          <Button size="sm" className="text-xs h-8">
            <Plus className="w-3.5 h-3.5" />
            Add Transaction
          </Button>
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-blue-500/20">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-xs font-semibold text-slate-200 leading-tight">
                {userName}
              </span>
              <span className="block text-[10px] text-slate-400 leading-tight">
                {userEmail}
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-medium text-slate-200">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Profile Settings
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0B0F19] border-b border-slate-800 p-4 space-y-2 shadow-2xl z-50 animate-in slide-in-from-top-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
