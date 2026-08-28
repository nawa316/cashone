import { z } from "zod";

export const TransactionTypeEnum = z.enum(["income", "expense", "transfer"]);

export const TransactionFormSchema = z
  .object({
    account_id: z.string().uuid("Please select a valid account"),
    destination_account_id: z.string().uuid().optional().nullable(),
    category_id: z.string().uuid().optional().nullable(),
    type: TransactionTypeEnum,
    amount: z.number().positive("Amount must be greater than zero"),
    fee: z.number().nonnegative("Fee cannot be negative").default(0),
    currency: z.string().length(3).default("USD"),
    transaction_date: z.string().default(() => new Date().toISOString()),
    notes: z.string().max(500).optional().nullable(),
    receipt_url: z.string().url().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === "transfer") {
        return (
          !!data.destination_account_id &&
          data.destination_account_id !== data.account_id
        );
      }
      return true;
    },
    {
      message: "Transfers require a different destination account",
      path: ["destination_account_id"],
    }
  );

export type TransactionFormInput = z.infer<typeof TransactionFormSchema>;
