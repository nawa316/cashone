import React from "react";
import { getGoals } from "@/lib/actions/goals.actions";
import { getAccounts } from "@/lib/actions/accounts.actions";
import { getUserProfile } from "@/lib/actions/profile.actions";
import { GoalsView } from "@/components/goals/goals-view";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function GoalsPage() {
  const [goals, accounts, profile] = await Promise.all([
    getGoals(),
    getAccounts(),
    getUserProfile(),
  ]);

  const userCurrency = profile?.default_currency || "USD";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Saving Goals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your progress towards your financial goals.
          </p>
        </div>
      </div>

      <GoalsView goals={goals} accounts={accounts} currency={userCurrency} />
    </div>
  );
}
