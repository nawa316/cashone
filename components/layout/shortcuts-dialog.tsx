"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard, Command, CornerDownLeft, Search } from "lucide-react";

export function ShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open on '?' when not inside an input/textarea
      if (
        e.key === "?" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName
        )
      ) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const shortcuts = [
    {
      keys: ["⌘", "K"],
      altKeys: ["Ctrl", "K"],
      label: "Open Universal Command Palette",
      description: "Search pages, trigger quick actions, or jump anywhere",
    },
    {
      keys: ["?"],
      label: "Open Keyboard Shortcuts",
      description: "View this shortcuts cheatsheet overlay",
    },
    {
      keys: ["Esc"],
      label: "Close Dialog / Lightbox",
      description: "Dismiss current modal, palette, or lightbox viewer",
    },
    {
      keys: ["↑", "↓"],
      label: "Navigate Command Palette",
      description: "Move up and down through list items",
    },
    {
      keys: ["↵"],
      label: "Select / Confirm",
      description: "Activate focused command or trigger action",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-slate-100 p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b border-slate-800">
          <DialogTitle className="text-base font-catamaran font-bold flex items-center gap-2 text-slate-100">
            <Keyboard className="w-4 h-4 text-blue-400" />
            Keyboard Shortcuts Cheatsheet
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-3">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80"
            >
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-slate-200">{s.label}</h4>
                <p className="text-[11px] text-slate-400">{s.description}</p>
              </div>

              <div className="flex items-center gap-1">
                {s.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] font-bold text-slate-200 shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
