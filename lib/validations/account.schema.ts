import { z } from "zod";

export const AccountTypeEnum = z.enum([
  "cash",
  "bank",
  "e_wallet",
  "savings",
  "investment",
  "credit_card",
]);

export const CreateAccountSchema = z.object({
  name: z.string().min(2, "Account name must be at least 2 characters").max(100),
  type: AccountTypeEnum,
  balance: z.number().default(0),
  currency: z.string().length(3).default("USD"),
  color_hex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #3B82F6)")
    .default("#3B82F6"),
  icon: z.string().default("wallet"),
});

export const UpdateAccountSchema = CreateAccountSchema.partial().extend({
  id: z.string().uuid(),
  is_archived: z.boolean().optional(),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;
