import { z } from "zod";

import {
  AttendanceChannel,
  ClientAttendanceActionType,
} from "@/app/generated/prisma/enums";

const SUBJECT_MAX_LENGTH = 180;
const LEGAL_AREA_MAX_LENGTH = 80;
const CONTACT_PERSON_MAX_LENGTH = 160;
export const LONG_TEXT_MAX_LENGTH = 10000;

/** String vazia e ausência viram `undefined` — o campo é opcional. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo de ${max} caracteres`)
    .optional()
    .transform((value) => value || undefined);

/**
 * O select de canal guarda `""` enquanto não preenchido, para o controle
 * do React Hook Form nunca alternar entre não controlado e controlado.
 * `""` não é um valor válido do enum, então é tratado como ausência antes
 * da validação real do enum.
 */
const optionalChannel = z
  .union([z.literal(""), z.enum(AttendanceChannel)])
  .optional()
  .transform((value) => (value ? value : undefined));

/**
 * Campos comuns aos dois modos. Salvar como rascunho não exige nada além
 * do formato — o mesmo comportamento do protótipo, onde "Salvar rascunho"
 * não passa pela validação e só "Finalizar" exige os campos obrigatórios.
 */
const attendanceFormFields = {
  channel: optionalChannel,
  contactPerson: optionalText(CONTACT_PERSON_MAX_LENGTH),
  legalArea: optionalText(LEGAL_AREA_MAX_LENGTH),
  subject: optionalText(SUBJECT_MAX_LENGTH),
  clientReport: optionalText(LONG_TEXT_MAX_LENGTH),
  preliminaryAnalysis: optionalText(LONG_TEXT_MAX_LENGTH),
  actions: z.array(z.enum(ClientAttendanceActionType)).default([]),
};

export const attendanceFormDraftSchema = z.object(attendanceFormFields);

/**
 * Validação aplicada só ao finalizar. Reaproveita os campos do rascunho e
 * substitui pelos requisitos completos — a mesma lista de obrigatórios do
 * protótipo (`requiredFields`), mais a exigência de ao menos uma ação.
 */
export const attendanceFormFinalizeSchema = z.object({
  ...attendanceFormFields,
  channel: z.enum(AttendanceChannel, {
    error: "Selecione o canal de atendimento",
  }),
  legalArea: z
    .string()
    .trim()
    .min(1, "Selecione a área jurídica")
    .max(LEGAL_AREA_MAX_LENGTH),
  subject: z
    .string()
    .trim()
    .min(5, "Informe um assunto com pelo menos 5 caracteres")
    .max(SUBJECT_MAX_LENGTH),
  clientReport: z
    .string()
    .trim()
    .min(20, "O relato deve possuir pelo menos 20 caracteres")
    .max(LONG_TEXT_MAX_LENGTH),
  preliminaryAnalysis: z
    .string()
    .trim()
    .min(20, "A análise deve possuir pelo menos 20 caracteres")
    .max(LONG_TEXT_MAX_LENGTH),
  actions: z
    .array(z.enum(ClientAttendanceActionType))
    .min(1, "Selecione pelo menos uma ação ou encaminhamento"),
});

/**
 * Forma "crua" mantida pelo formulário: todo campo textual em string
 * (nunca `undefined`), e `channel` aceitando `""` como não preenchido.
 * `z.input`/`z.output` do schema de rascunho não servem para isso porque
 * `.optional()` os deixaria `undefined`-áveis de saída, não de entrada
 * controlada.
 */
export type AttendanceFormValues = {
  channel: AttendanceChannel | "";
  contactPerson: string;
  legalArea: string;
  subject: string;
  clientReport: string;
  preliminaryAnalysis: string;
  actions: ClientAttendanceActionType[];
};

export type AttendanceFormDraftParsed = z.infer<
  typeof attendanceFormDraftSchema
>;
export type AttendanceFormFinalizedValues = z.infer<
  typeof attendanceFormFinalizeSchema
>;
