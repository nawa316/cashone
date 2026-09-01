import { z } from "zod";

export const CreateGoalSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  account_id: z.string().uuid("Invalid account ID"),
  target_amount: z.number().positive("Target amount must be positive"),
  target_date: z.string().nullable().optional(),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
  icon: z.string().min(1).optional(),
});

export const UpdateGoalSchema = CreateGoalSchema.partial();
