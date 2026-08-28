"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/lib/actions/accounts.actions";
import {
  Wallet,
  Building2,
  Smartphone,
  PieChart,
  CreditCard,
  PiggyBank,
  Trash2,
  Edit2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
    color_hex: string;
    icon: string;
    is_archived: boolean;
  };
  onEdit?: (account: any) => void;
}

export function AccountCard({ account, onEdit }: AccountCardProps) {
  const getAccountIcon = (type: string) => {
    switch (type) {
      case "bank":
        return Building2;
      case "savings":
        return PiggyBank;
      case "e_wallet":
        return Smartphone;
      case "investment":
        return PieChart;
      case "credit_card":
        return CreditCard;
      default:
        return Wallet;
    }
  };

  const Icon = getAccountIcon(account.type);

  return (
    <Card className="glass-card hover:border-slate-700 transition-all group relative overflow-hidden">
      {/* Top Color Accent Line */}
      <div
        className="h-1 w-full absolute top-0 left-0"
        style={{ backgroundColor: account.color_hex || "#3B82F6" }}
      />

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{
                backgroundColor: `${account.color_hex}25`,
                color: account.color_hex || "#3B82F6",
                border: `1px solid ${account.color_hex}40`,
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-catamaran text-lg font-bold text-slate-100">
                {account.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                  {account.type.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-slate-400 hover:text-white"
                onClick={() => onEdit(account)}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
            )}
            <form
              action={async () => {
                if (confirm(`Delete account "${account.name}"?`)) {
                  await deleteAccount(account.id);
                }
              }}
            >
              <Button
                size="icon"
                variant="ghost"
                type="submit"
                className="h-7 w-7 text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Balance Display */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Current Balance
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-catamaran text-2xl font-bold text-slate-100">
              {formatCurrency(account.balance, account.currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
