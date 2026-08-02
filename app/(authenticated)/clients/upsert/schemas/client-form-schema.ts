import { z } from "zod";

import { ClientStatus, ClientType } from "@/app/generated/prisma/enums";

import { brazilianStateValues } from "../data/brazilian-states";
import { PHONE_MAX_DIGITS, POSTAL_CODE_LENGTH } from "../utils/input-masks";
import { isValidDocumentForType } from "../utils/validate-document";

const NOTES_MAX_LENGTH = 5000;

/** Campo de texto opcional: string vazia e `undefined` viram `undefined`. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo de ${max} caracteres`)
    .optional()
    .transform((value) => value || undefined);

const addressSchema = z.object({
  postalCode: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine(
      (value) => !value || value.length === POSTAL_CODE_LENGTH,
      "O CEP precisa ter 8 dígitos",
    ),
  street: optionalText(160),
  number: optionalText(30),
  complement: optionalText(100),
  district: optionalText(100),
  city: optionalText(100),
  state: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine(
      (value) => !value || brazilianStateValues.includes(value),
      "Selecione uma UF válida",
    ),
  country: z.string().trim().length(2).default("BR"),
});

/**
 * Schema único do formulário de cliente, usado pelo `zodResolver` no
 * navegador e novamente dentro das Server Actions — a validação no cliente
 * é conveniência, a do servidor é o que garante integridade.
 *
 * Documento, telefone e CEP chegam já reduzidos a dígitos, no mesmo
 * formato em que são gravados.
 */
export const clientFormSchema = z
  .object({
    type: z.enum(ClientType),
    status: z.enum(ClientStatus),

    name: z
      .string()
      .trim()
      .min(3, "O nome precisa ter pelo menos 3 caracteres")
      .max(160, "Máximo de 160 caracteres"),

    displayName: optionalText(160),

    document: z.string().trim().regex(/^\d+$/, "Informe apenas números"),

    birthDate: optionalText(10),
    profession: optionalText(120),
    nationality: optionalText(60),
    rgNumber: optionalText(20),
    stateRegistration: optionalText(30),
    municipalRegistration: optionalText(30),

    email: z
      .union([z.literal(""), z.email("Informe um e-mail válido").max(254)])
      .optional()
      .transform((value) => value || undefined),

    phone: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined)
      .refine(
        (value) =>
          !value || (value.length >= 10 && value.length <= PHONE_MAX_DIGITS),
        "Informe um telefone válido com DDD",
      ),

    responsibleId: z.uuid("Selecione um responsável"),

    notes: optionalText(NOTES_MAX_LENGTH),

    address: addressSchema,
  })
  .superRefine((values, ctx) => {
    // O documento só pode ser validado junto do tipo: o mesmo campo é CPF
    // ou CNPJ dependendo da escolha feita acima.
    if (!isValidDocumentForType(values.document, values.type)) {
      ctx.addIssue({
        code: "custom",
        path: ["document"],
        message:
          values.type === "PESSOA_FISICA" ? "CPF inválido" : "CNPJ inválido",
      });
    }

    if (values.type === "PESSOA_JURIDICA") {
      for (const field of [
        "birthDate",
        "profession",
        "nationality",
        "rgNumber",
      ] as const) {
        if (values[field]) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: "Campo se aplica apenas a pessoa física",
          });
        }
      }
    }

    if (values.type === "PESSOA_FISICA") {
      for (const field of [
        "stateRegistration",
        "municipalRegistration",
      ] as const) {
        if (values[field]) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: "Inscrição se aplica apenas a pessoa jurídica",
          });
        }
      }
    }
  });

export type ClientFormInput = z.input<typeof clientFormSchema>;
export type ClientFormValues = z.output<typeof clientFormSchema>;
export { NOTES_MAX_LENGTH };
