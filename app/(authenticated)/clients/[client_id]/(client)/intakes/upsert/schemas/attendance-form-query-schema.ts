import { z } from "zod";

export const attendanceFormQuerySchema = z.object({
  formId: z.uuid().optional(),
});
