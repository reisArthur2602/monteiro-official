import { z } from "zod";

import { TemplateCategory, TemplateStatus } from "@/app/generated/prisma/enums";

export const listTemplatesParamsSchema = z.object({
  search: z.string().trim().min(1).max(120).optional().catch(undefined),
  category: z.enum(TemplateCategory).optional().catch(undefined),
  area: z.string().trim().min(1).max(80).optional().catch(undefined),
  status: z.enum(TemplateStatus).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(9999).catch(1),
});

export type ListTemplatesParams = z.infer<typeof listTemplatesParamsSchema>;
