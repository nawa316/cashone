import React from "react";
import { getCategories, deleteCategory } from "@/lib/actions/categories.actions";
import { CategoriesHeader } from "@/components/categories/categories-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, Trash2, Tag } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await getCategories();

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="space-y-8">
      <CategoriesHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Categories */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              Income Categories
            </CardTitle>
            <Badge variant="profit" className="text-[10px]">
              {incomeCategories.length} Categories
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {incomeCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: `${cat.color_hex}20`,
                      color: cat.color_hex,
                      border: `1px solid ${cat.color_hex}40`,
                    }}
                  >
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{cat.name}</h4>
                    <span className="text-[10px] text-slate-500">
                      {cat.is_system ? "Default System Category" : "Custom User Category"}
                    </span>
                  </div>
                </div>

                {!cat.is_system && (
                  <form
                    action={async () => {
                      "use server";
                      await deleteCategory(cat.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
              Expense Categories
            </CardTitle>
            <Badge variant="loss" className="text-[10px]">
              {expenseCategories.length} Categories
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {expenseCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: `${cat.color_hex}20`,
                      color: cat.color_hex,
                      border: `1px solid ${cat.color_hex}40`,
                    }}
                  >
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{cat.name}</h4>
                    <span className="text-[10px] text-slate-500">
                      {cat.is_system ? "Default System Category" : "Custom User Category"}
                    </span>
                  </div>
                </div>

                {!cat.is_system && (
                  <form
                    action={async () => {
                      "use server";
                      await deleteCategory(cat.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
