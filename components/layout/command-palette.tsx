"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  Repeat,
  BarChart3,
  Tags,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Command,
} from "lucide-react";

interface PaletteItem {
  id: string;
  category: "Navigation" | "Quick Actions";
  title: string;
  subtitle?: string;
  href: string;
  icon: any;
  shortcut?: string;
}

const defaultItems: PaletteItem[] = [
  // Navigation
  {
    id: "nav-dashboard",
    category: "Navigation",
    title: "Financial Dashboard",
    subtitle: "Overview of balances, cash flow, and spending",
    href: "/",
    icon: LayoutDashboard,
    shortcut: "G D",
  },
  {
    id: "nav-accounts",
    category: "Navigation",
    title: "Accounts & Wallets",
    subtitle: "Manage checking, savings, e-wallets, and cash",
    href: "/accounts",
    icon: Wallet,
    shortcut: "G A",
  },
  {
    id: "nav-transactions",
    category: "Navigation",
    title: "Transaction Ledger",
    subtitle: "View and record single & double-entry transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
    shortcut: "G T",
  },
  {
    id: "nav-budgets",
    category: "Navigation",
    title: "Budgets & Spending Limits",
    subtitle: "Category monthly limits and alert thresholds",
    href: "/budgets",
    icon: PiggyBank,
    shortcut: "G B",
  },
  {
    id: "nav-recurring",
    category: "Navigation",
    title: "Recurring & Bills Planner",
    subtitle: "Automate routine subscriptions and salaries",
    href: "/recurring",
    icon: Repeat,
    shortcut: "G R",
  },
  {
    id: "nav-analytics",
    category: "Navigation",
    title: "Financial Analytics & Reports",
    subtitle: "Cashflow trajectory, spending breakdown, asset allocation",
    href: "/analytics",
    icon: BarChart3,
    shortcut: "G Y",
  },
  {
    id: "nav-categories",
    category: "Navigation",
    title: "Category Management",
    subtitle: "Configure income & expense categories",
    href: "/categories",
    icon: Tags,
    shortcut: "G C",
  },
  {
    id: "nav-settings",
    category: "Navigation",
    title: "Settings & Preferences",
    subtitle: "Profile details, default currency, and export options",
    href: "/settings",
    icon: Settings,
    shortcut: "G S",
  },
  // Actions
  {
    id: "act-new-tx",
    category: "Quick Actions",
    title: "Record Transaction",
    subtitle: "Log income, expense, or double-entry transfer",
    href: "/transactions",
    icon: Plus,
    shortcut: "N T",
  },
  {
    id: "act-new-account",
    category: "Quick Actions",
    title: "Add Bank Account or Wallet",
    subtitle: "Connect a checking account, e-wallet, or crypto fund",
    href: "/accounts",
    icon: Wallet,
    shortcut: "N A",
  },
  {
    id: "act-new-budget",
    category: "Quick Actions",
    title: "Set Monthly Budget Limit",
    subtitle: "Establish spending boundary for category",
    href: "/budgets",
    icon: PiggyBank,
    shortcut: "N B",
  },
  {
    id: "act-new-recurring",
    category: "Quick Actions",
    title: "Create Recurring Schedule",
    subtitle: "Setup automated bill or salary subscription",
    href: "/recurring",
    icon: Repeat,
    shortcut: "N R",
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keydown listener for ⌘K / Ctrl+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [open]);

  // Filter items
  const filtered = defaultItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation inside palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((idx) => (idx + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((idx) =>
        idx <= 0 ? filtered.length - 1 : idx - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: PaletteItem) => {
    setOpen(false);
    router.push(item.href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative max-w-xl w-full bg-[#0E1526] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/40">
          <Search className="w-5 h-5 text-blue-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search accounts, ledger, or pages..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            className="flex-1 bg-transparent border-none outline-hidden text-sm text-slate-100 placeholder:text-slate-500"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 rounded border border-slate-700 text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[400px]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching commands or pages found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-600/15 border border-blue-500/30 text-white shadow-xs"
                      : "text-slate-300 hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-slate-200 block truncate">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-[11px] text-slate-400 block truncate">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[9px] bg-slate-900 rounded border border-slate-800 text-slate-400 font-mono">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                ↑
              </kbd>{" "}
              <kbd className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                ↓
              </kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                ↵
              </kbd>{" "}
              to select
            </span>
          </div>
          <span className="text-[10px] flex items-center gap-1 text-slate-400">
            <Command className="w-3 h-3" /> Quick Switcher
          </span>
        </div>
      </div>
    </div>
  );
}
