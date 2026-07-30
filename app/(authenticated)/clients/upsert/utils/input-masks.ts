import type { ClientType } from "@/app/generated/prisma/enums";

import { CNPJ_LENGTH, CPF_LENGTH } from "./validate-document";

export const PHONE_MAX_DIGITS = 15;
export const POSTAL_CODE_LENGTH = 8;

/**
 * Máscaras de exibição.
 *
 * O formulário guarda sempre dígitos — o mesmo formato do banco —, e estas
 * funções só montam o que aparece no campo. Isso mantém o mapeamento entre
 * formulário e Prisma direto, sem transformação no meio do caminho.
 */
export const maskDigits = (value: string, max: number) =>
  value.replace(/\D/g, "").slice(0, max);

export const maskCpf = (digits: string) =>
  digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");

export const maskCnpj = (digits: string) =>
  digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,4})$/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");

export const maskDocument = (digits: string, type: ClientType) =>
  type === "PESSOA_FISICA" ? maskCpf(digits) : maskCnpj(digits);

export const documentMaxDigits = (type: ClientType) =>
  type === "PESSOA_FISICA" ? CPF_LENGTH : CNPJ_LENGTH;

/**
 * Telefone nacional em `(11) 98888-1212` e internacional a partir de 12
 * dígitos, já que o campo aceita até 15.
 */
export const maskPhone = (digits: string) => {
  if (digits.length > 11) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }

  if (digits.length > 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
};

export const maskPostalCode = (digits: string) =>
  digits.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
