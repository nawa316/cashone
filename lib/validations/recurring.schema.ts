import { z } from "zod";

export const RecurringFrequencyEnum = z.enum(["daily", "weekly", "monthly", "yearly"]);

export const RecurringFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.number().positive("Amount must be greater than zero"),
  frequency: RecurringFrequencyEnum,
  account_id: z.string().min(1, "Account is required"),
  destination_account_id: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  start_date: z.string().min(1, "Start date is required"),
  notes: z.string().max(255).optional().nullable(),
});

export type RecurringFormValues = z.infer<typeof RecurringFormSchema>;
