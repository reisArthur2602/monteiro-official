import { z } from "zod";

import {
  ClientDocumentCategory,
  ClientDocumentVisibility,
} from "@/app/generated/prisma/enums";
import { MAX_UPLOAD_BYTES } from "@/lib/ftp-limits";

/**
 * Schema do formulário de upload. Difere do schema da rota porque aqui os
 * campos vazios chegam como string vazia, `tags` ainda é texto livre
 * separado por vírgula, e o arquivo ainda é um `File`. A validação da
 * rota continua sendo a que vale para segurança.
 */
export const uploadDocumentFormSchema = z.object({
  title: z.string().trim().max(200),
  description: z.string().trim().max(500),
  category: z.enum(ClientDocumentCategory, {
    message: "Selecione a categoria",
  }),
  visibility: z.enum(ClientDocumentVisibility),
  documentDate: z.string(),
  tags: z.string().trim().max(200),
  file: z
    .instanceof(File, { message: "Selecione um arquivo" })
    .refine((file) => file.size > 0, "Selecione um arquivo")
    .refine(
      (file) => file.size <= MAX_UPLOAD_BYTES,
      "O arquivo excede o limite de 25 MB",
    ),
});

export type UploadDocumentFormInput = z.infer<typeof uploadDocumentFormSchema>;
