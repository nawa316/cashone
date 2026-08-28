"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { Plus, Tags } from "lucide-react";

export function CategoriesHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-catamaran text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Tags className="w-6 h-6 text-emerald-400" />
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            System defaults and custom user categories for income and expense classification.
          </p>
        </div>

        <div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="font-semibold text-xs shadow-lg shadow-emerald-500/20"
            variant="profit"
          >
            <Plus className="w-4 h-4" />
            Add Custom Category
          </Button>
        </div>
      </div>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
