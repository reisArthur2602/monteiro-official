import { z } from "zod";

import { TemplateCategory } from "@/app/generated/prisma/enums";

export const listClientTemplatesParamsSchema = z.object({
  search: z.string().trim().min(1).max(120).optional().catch(undefined),
  category: z.enum(TemplateCategory).optional().catch(undefined),
});

export type ListClientTemplatesParams = z.infer<
  typeof listClientTemplatesParamsSchema
>;
