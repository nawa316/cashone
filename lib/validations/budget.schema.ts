import { z } from "zod";

export const BudgetPeriodEnum = z.enum(["monthly", "weekly", "yearly", "custom"]);

export const CreateBudgetSchema = z.object({
  category_id: z.string().uuid("Please select a valid expense category"),
  limit_amount: z.number().positive("Budget limit must be greater than zero"),
  period: BudgetPeriodEnum.default("monthly"),
  start_date: z.string().default(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  }),
  end_date: z.string().default(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  }),
});

export const UpdateBudgetSchema = z.object({
  id: z.string().uuid(),
  limit_amount: z.number().positive("Budget limit must be greater than zero"),
  period: BudgetPeriodEnum.optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type CreateBudgetInput = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof UpdateBudgetSchema>;
