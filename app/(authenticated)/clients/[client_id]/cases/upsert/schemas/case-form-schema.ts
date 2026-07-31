import { z } from "zod";

import {
  ProcessClientRole,
  ProcessStatus,
  ProcessType,
} from "@/app/generated/prisma/enums";

import { brazilianStateValues } from "../../../../upsert/data/brazilian-states";

const INTERNAL_CODE_MAX_LENGTH = 40;
const NUMBER_MAX_LENGTH = 40;
const TITLE_MAX_LENGTH = 180;
const LEGAL_AREA_MAX_LENGTH = 80;
const COURT_MAX_LENGTH = 180;
const JURISDICTION_MAX_LENGTH = 160;
export const NOTES_MAX_LENGTH = 5000;

/** String vazia e ausência viram `undefined` — o campo é opcional. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo de ${max} caracteres`)
    .optional()
    .transform((value) => value || undefined);

/**
 * Os selects guardam `""` enquanto não preenchidos, para o controle do
 * React Hook Form nunca alternar entre não controlado e controlado. `""`
 * não pertence ao enum, então vira erro de "selecione" em vez de erro de
 * formato.
 */
const requiredEnum = <T extends Record<string, string>>(
  values: T,
  message: string,
) =>
  z
    .union([z.literal(""), z.enum(values)])
    .refine((value): value is T[keyof T] => value !== "", { message });

/**
 * UF opcional, restrita às 27 unidades federativas. `@db.Char(2)` no banco
 * aceitaria qualquer par de caracteres, então a checagem real é aqui.
 */
const optionalState = z
  .union([z.literal(""), z.string().trim().length(2)])
  .optional()
  .transform((value) => value || undefined)
  .refine((value) => !value || brazilianStateValues.includes(value), {
    message: "UF inválida",
  });

/** Data civil no formato do input `type="date"`. */
const optionalCivilDate = z
  .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")])
  .optional()
  .transform((value) => value || undefined);

export const caseFormSchema = z.object({
  internalCode: z
    .string()
    .trim()
    .min(1, "Informe o código interno")
    .max(INTERNAL_CODE_MAX_LENGTH),
  number: optionalText(NUMBER_MAX_LENGTH),
  title: z
    .string()
    .trim()
    .min(5, "Informe um assunto com pelo menos 5 caracteres")
    .max(TITLE_MAX_LENGTH),
  legalArea: z
    .string()
    .trim()
    .min(1, "Informe a área jurídica")
    .max(LEGAL_AREA_MAX_LENGTH),
  type: requiredEnum(ProcessType, "Selecione o tipo do processo"),
  clientRole: requiredEnum(ProcessClientRole, "Selecione a posição do cliente"),
  status: requiredEnum(ProcessStatus, "Selecione o status"),
  court: optionalText(COURT_MAX_LENGTH),
  courtUnit: optionalText(COURT_MAX_LENGTH),
  jurisdiction: optionalText(JURISDICTION_MAX_LENGTH),
  state: optionalState,
  filingDate: optionalCivilDate,
  notes: optionalText(NOTES_MAX_LENGTH),
});

/**
 * Forma "crua" mantida pelo formulário: todo campo textual em string
 * (nunca `undefined`) e os selects aceitando `""` como não preenchido.
 * `z.input` não serve porque `.optional()` deixaria os campos
 * `undefined`-áveis, quebrando o controle do React Hook Form.
 */
export type CaseFormValues = {
  internalCode: string;
  number: string;
  title: string;
  legalArea: string;
  type: ProcessType | "";
  clientRole: ProcessClientRole | "";
  status: ProcessStatus | "";
  court: string;
  courtUnit: string;
  jurisdiction: string;
  state: string;
  filingDate: string;
  notes: string;
};

export type CaseFormParsed = z.infer<typeof caseFormSchema>;
