import { z } from "zod";

import {
  ClientDocumentCategory,
  ClientDocumentVisibility,
} from "@/app/generated/prisma/enums";

/**
 * Campos de metadados que acompanham o upload. O arquivo em si é validado
 * separadamente em `lib/ftp`, porque tipo, extensão e tamanho não passam
 * pelo mesmo caminho de um campo de formulário.
 *
 * `title` é opcional: sem título, a rota usa o nome do arquivo, como no
 * protótipo de upload múltiplo.
 */
export const uploadDocumentSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(500).optional(),
  category: z.enum(ClientDocumentCategory, {
    message: "Selecione a categoria",
  }),
  visibility: z.enum(ClientDocumentVisibility).default("EQUIPE"),
  documentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
