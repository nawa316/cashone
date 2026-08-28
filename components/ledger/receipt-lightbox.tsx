"use client";

import React, { useState } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ExternalLink,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ReceiptLightboxProps {
  receiptUrl: string | null;
  transaction?: any;
  onClose: () => void;
}

export function ReceiptLightbox({
  receiptUrl,
  transaction,
  onClose,
}: ReceiptLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!receiptUrl) return null;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-catamaran font-bold text-sm text-slate-100">
                Receipt Attachment Inspection
              </h3>
              <p className="text-[10px] text-slate-400">
                Verified cryptographically stored attachment
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-white"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-white"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-white"
              onClick={handleRotate}
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <a
              href={receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open Original"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 ml-2"
              onClick={onClose}
              title="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Image Stage Area */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-[#070A12] min-h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={receiptUrl}
            alt="Transaction Receipt"
            className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />
        </div>

        {/* Transaction Metadata Bar (if transaction provided) */}
        {transaction && (
          <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-200">
                {transaction.notes || transaction.category?.name || "Transaction"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                {new Date(transaction.transaction_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                {transaction.account?.name || "Account"}
              </span>
            </div>

            <div className="font-catamaran font-bold text-sm text-slate-100">
              {formatCurrency(transaction.amount, transaction.currency)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
