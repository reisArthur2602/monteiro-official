import { z } from "zod";

import {
  templateDraftSchema,
  templatePublishSchema,
} from "./template-form-schema";

/** Payload do primeiro autosave, que ainda não tem template no banco. */
export const createTemplateDraftSchema = z.object({
  values: templateDraftSchema,
});

/** Payload dos autosaves seguintes. `revision` detecta edição concorrente. */
export const updateTemplateDraftSchema = z.object({
  templateId: z.uuid(),
  revision: z.number().int().min(1),
  values: templateDraftSchema,
});

/** A publicação usa o schema estrito: exige nome válido e documento com conteúdo. */
export const publishTemplateVersionSchema = z.object({
  templateId: z.uuid(),
  revision: z.number().int().min(1),
  values: templatePublishSchema,
});

export type CreateTemplateDraftInput = z.infer<
  typeof createTemplateDraftSchema
>;
export type UpdateTemplateDraftInput = z.infer<
  typeof updateTemplateDraftSchema
>;
export type PublishTemplateVersionInput = z.infer<
  typeof publishTemplateVersionSchema
>;
