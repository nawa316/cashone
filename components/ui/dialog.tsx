"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog Container */}
      <div className="relative z-50 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({
  className,
  children,
  onClose,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-slate-800 bg-[#0F172A] p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left mb-5", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-catamaran text-xl font-bold leading-none tracking-tight text-white",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-400 mt-1", className)} {...props} />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 pt-4 border-t border-slate-800/80 mt-5",
        className
      )}
      {...props}
    />
  );
}
