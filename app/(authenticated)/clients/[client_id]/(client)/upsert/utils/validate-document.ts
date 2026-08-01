export const CPF_LENGTH = 11;
export const CNPJ_LENGTH = 14;

/**
 * Dígito verificador pelo módulo 11, usado por CPF e CNPJ.
 * Resto menor que 2 resulta em zero; caso contrário, `11 - resto`.
 */
const checkDigit = (digits: number[], weights: number[]) => {
  const sum = weights.reduce(
    (total, weight, index) => total + (digits[index] ?? 0) * weight,
    0,
  );

  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
};

const toDigits = (value: string) => [...value].map(Number);

const hasRepeatedDigits = (value: string) => /^(\d)\1+$/.test(value);

/**
 * Valida CPF pelos dígitos verificadores.
 *
 * Sequências repetidas ("111.111.111-11") satisfazem o módulo 11 por
 * coincidência aritmética, então são rejeitadas explicitamente.
 */
export const isValidCpf = (value: string) => {
  if (value.length !== CPF_LENGTH || hasRepeatedDigits(value)) {
    return false;
  }

  const digits = toDigits(value);

  const first = checkDigit(digits, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = checkDigit(digits, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

  return digits[9] === first && digits[10] === second;
};

/** Valida CNPJ pelos dígitos verificadores. */
export const isValidCnpj = (value: string) => {
  if (value.length !== CNPJ_LENGTH || hasRepeatedDigits(value)) {
    return false;
  }

  const digits = toDigits(value);

  const first = checkDigit(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = checkDigit(digits, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return digits[12] === first && digits[13] === second;
};

/**
 * O documento correto depende do tipo de cliente, então a validação é
 * feita no nível do objeto — não dá para validar `document` isoladamente.
 *
 * Vale para cliente e servidor: um CPF inválido acabaria impresso numa
 * procuração e protocolado em juízo, então não basta conferir o tamanho.
 */
export const isValidDocumentForType = (
  document: string,
  type: "PESSOA_FISICA" | "PESSOA_JURIDICA",
) => (type === "PESSOA_FISICA" ? isValidCpf(document) : isValidCnpj(document));
