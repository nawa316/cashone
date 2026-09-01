"use client";

import React, { useState } from "react";
import { type SavingGoal } from "@/lib/actions/goals.actions";
import { type Account } from "@/lib/actions/accounts.actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GoalCard } from "./goal-card";
import { CreateGoalDialog } from "./create-goal-dialog";
import { EditGoalDialog } from "./edit-goal-dialog";

interface GoalsViewProps {
  goals: SavingGoal[];
  accounts: Account[];
  currency: string;
}

export function GoalsView({ goals, accounts, currency }: GoalsViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-xl">
          <h3 className="text-slate-300 font-medium">No goals found</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">Start saving by creating a new goal.</p>
          <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
            Create your first goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const linkedAccount = accounts.find((a) => a.id === goal.account_id);
            const currentBalance = linkedAccount ? linkedAccount.balance : 0;
            return (
              <GoalCard
                key={goal.id}
                goal={goal}
                currentBalance={currentBalance}
                currency={currency}
                onEdit={() => setEditingGoal(goal)}
              />
            );
          })}
        </div>
      )}

      <CreateGoalDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        accounts={accounts}
      />

      {editingGoal && (
        <EditGoalDialog
          goal={editingGoal}
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
          accounts={accounts}
        />
      )}
    </div>
  );
}
