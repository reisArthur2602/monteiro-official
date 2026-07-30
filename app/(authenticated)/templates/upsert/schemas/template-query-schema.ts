import { z } from "zod";

export const templateQuerySchema = z.object({
  templateId: z.uuid().optional(),
});

export type TemplateQuery = z.infer<typeof templateQuerySchema>;
