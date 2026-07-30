import { z } from "zod";

export const clientQuerySchema = z.object({
  clientId: z.uuid().optional(),
});

export type ClientQuery = z.infer<typeof clientQuerySchema>;
