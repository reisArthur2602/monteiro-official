import { z } from "zod";

export const sendClientTemplateEmailSchema = z.object({
  to: z.email("Informe um e-mail válido"),
  cc: z.union([z.email("Informe um e-mail válido"), z.literal("")]).optional(),
  subject: z.string().trim().min(1, "Informe o assunto").max(200),
  message: z.string().trim().min(1, "Informe a mensagem").max(5000),
});

export type SendClientTemplateEmailInput = z.infer<
  typeof sendClientTemplateEmailSchema
>;
