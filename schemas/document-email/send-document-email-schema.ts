import { z } from "zod";

/**
 * Compartilhado por todo formato de documento que possa ser enviado por
 * e-mail (modelo preenchido, ficha de atendimento, futuros relatórios) — o
 * formulário de envio é sempre o mesmo: destinatário, cópia opcional,
 * assunto e mensagem.
 */
export const sendDocumentEmailSchema = z.object({
  to: z.email("Informe um e-mail válido"),
  cc: z.union([z.email("Informe um e-mail válido"), z.literal("")]).optional(),
  subject: z.string().trim().min(1, "Informe o assunto").max(200),
  message: z.string().trim().min(1, "Informe a mensagem").max(5000),
});

export type SendDocumentEmailInput = z.infer<typeof sendDocumentEmailSchema>;
