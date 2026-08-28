import { z } from "zod";

export const CategoryTypeEnum = z.enum(["income", "expense"]);

export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100),
  type: CategoryTypeEnum,
  icon: z.string().default("tag"),
  color_hex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .default("#10B981"),
  parent_id: z.string().uuid().optional().nullable(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
