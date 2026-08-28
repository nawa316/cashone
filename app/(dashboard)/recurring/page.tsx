import React from "react";
import { getRecurringTemplates } from "@/lib/actions/recurring.actions";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { getCategories } from "@/lib/actions/categories.actions";
import { RecurringHeader } from "@/components/recurring/recurring-header";
import { RecurringCard } from "@/components/recurring/recurring-card";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Repeat, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default async function RecurringPage() {
  const [templates, accounts, categories] = await Promise.all([
    getRecurringTemplates(),
    getAccounts(),
    getCategories(),
  ]);

  const totalMonthlyScheduledOutflow = templates
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalMonthlyScheduledInflow = templates
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header & Modal CTA */}
      <RecurringHeader accounts={accounts} categories={categories} />

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Scheduled Income */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Scheduled Inflows
              </span>
              <span className="font-catamaran font-bold text-xl text-emerald-400">
                +{formatCurrency(totalMonthlyScheduledInflow)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Expenses */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Scheduled Bills & Outflows
              </span>
              <span className="font-catamaran font-bold text-xl text-rose-400">
                -{formatCurrency(totalMonthlyScheduledOutflow)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Active Schedules Count */}
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                Active Schedules
              </span>
              <span className="font-catamaran font-bold text-xl text-blue-400">
                {templates.length} Active Plans
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400">
              <Repeat className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-catamaran text-lg font-bold text-slate-100">
            Active Recurring Subscriptions & Bills
          </h2>
          <span className="text-xs font-catamaran font-semibold text-slate-400">
            {templates.length} Total Plans
          </span>
        </div>

        {templates.length === 0 ? (
          <Card className="glass-card border-dashed border-slate-800">
            <CardContent className="p-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">
                No recurring schedules configured
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Set up recurring templates for recurring payments (e.g. Netflix, Gym memberships, Apartment rent, or Salary) to log them to your ledger in 1 click.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <RecurringCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
