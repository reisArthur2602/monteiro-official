export type PasswordRequirementKey =
  | "length"
  | "uppercase"
  | "number"
  | "symbol";

export type PasswordRequirements = Record<PasswordRequirementKey, boolean>;

export const PASSWORD_MIN_LENGTH = 10;

/**
 * Uma verificação por requisito, não só um booleano geral — é o que
 * alimenta o checklist visual (cada item marca o próprio estado) além da
 * validação em si. `\p{Lu}`/`\p{L}` cobrem letras acentuadas nativamente,
 * sem precisar listar `áàâãäéê...` à mão.
 */
export const evaluatePasswordStrength = (
  value: string,
): PasswordRequirements => ({
  length: value.length >= PASSWORD_MIN_LENGTH,
  uppercase: /\p{Lu}/u.test(value),
  number: /\d/.test(value),
  symbol: /[^\p{L}\p{N}\s]/u.test(value),
});

export const countMetPasswordRequirements = (
  requirements: PasswordRequirements,
) => Object.values(requirements).filter(Boolean).length;

export const isPasswordStrongEnough = (value: string) =>
  countMetPasswordRequirements(evaluatePasswordStrength(value)) === 4;
