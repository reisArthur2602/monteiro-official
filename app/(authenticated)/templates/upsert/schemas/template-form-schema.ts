import { z } from "zod";

import { TemplateCategory } from "@/app/generated/prisma/enums";

import { isEmptyDocument } from "../utils/document-content";

const MAX_MARGIN_MM = 80;

const usedVariableSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  source: z.enum(["CLIENT", "CASE", "OFFICE", "DOCUMENT"]),
});

const signatureSchema = z
  .object({
    id: z.string().optional(),
    label: z
      .string()
      .trim()
      .min(1, "Informe a identificação da assinatura")
      .max(80, "Máximo de 80 caracteres"),
    nameSource: z.enum(["VARIABLE", "FIXED"]),
    nameVariable: z.string().trim().max(80).optional(),
    fixedName: z.string().trim().max(150).optional(),
    role: z.string().trim().max(120).optional(),
  })
  .superRefine((signature, ctx) => {
    if (signature.nameSource === "VARIABLE" && !signature.nameVariable) {
      ctx.addIssue({
        code: "custom",
        path: ["nameVariable"],
        message: "Selecione a variável que preenche o nome",
      });
    }

    if (signature.nameSource === "FIXED" && !signature.fixedName) {
      ctx.addIssue({
        code: "custom",
        path: ["fixedName"],
        message: "Informe o nome que será impresso",
      });
    }
  });

const marginSchema = z
  .number()
  .int("Use um número inteiro")
  .min(0, "A margem não pode ser negativa")
  .max(MAX_MARGIN_MM, `A margem máxima é ${MAX_MARGIN_MM} mm`);

const pageSchema = z.object({
  format: z.literal("A4"),
  orientation: z.enum(["PORTRAIT", "LANDSCAPE"]),
  marginTop: marginSchema,
  marginRight: marginSchema,
  marginBottom: marginSchema,
  marginLeft: marginSchema,
  showInstitutionalHeader: z.boolean(),
  showInstitutionalFooter: z.boolean(),
  city: z.string().trim().max(100, "Máximo de 100 caracteres"),
});

const documentSchema = z.object({
  contentJson: z.record(z.string(), z.unknown()),
  contentHtml: z.string(),
  usedVariables: z.array(usedVariableSchema),
  signatures: z.array(signatureSchema),
  page: pageSchema,
});

/**
 * Schema do formulário na tela. Valida formato e limites de cada campo,
 * mas não exige documento preenchido — isso só é cobrado ao publicar.
 */
export const templateFormSchema = z.object({
  id: z.uuid().optional(),
  name: z
    .string()
    .trim()
    .min(3, "O nome precisa ter pelo menos 3 caracteres")
    .max(160, "Máximo de 160 caracteres"),
  description: z.string().trim().max(500, "Máximo de 500 caracteres"),
  category: z.enum(TemplateCategory),
  legalArea: z.string().trim().max(80, "Máximo de 80 caracteres"),
  document: documentSchema,
});

/**
 * Schema aceito pelo autosave. É deliberadamente permissivo: o nome ainda
 * pode estar vazio e o documento em branco, porque o rascunho é gravado
 * enquanto o usuário digita.
 */
export const templateDraftSchema = templateFormSchema.extend({
  name: z.string().trim().max(160, "Máximo de 160 caracteres"),
});

/**
 * Schema da publicação. Além dos limites de campo, exige um documento com
 * conteúdo — uma versão imutável vazia não faz sentido.
 */
export const templatePublishSchema = templateFormSchema.superRefine(
  (values, ctx) => {
    if (isEmptyDocument(values.document.contentJson)) {
      ctx.addIssue({
        code: "custom",
        path: ["document", "contentJson"],
        message: "Escreva o conteúdo do documento antes de publicar",
      });
    }
  },
);

export type TemplateFormInput = z.infer<typeof templateFormSchema>;
export type TemplateDraftInput = z.infer<typeof templateDraftSchema>;
export type TemplatePublishInput = z.infer<typeof templatePublishSchema>;
