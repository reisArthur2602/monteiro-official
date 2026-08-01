/**
 * Detecta violação de índice único do Prisma (P2002) sem depender da
 * classe de erro exportada pelo client gerado.
 */
const isUniqueViolation = (
  error: unknown,
): error is { code: string; meta?: { target?: unknown } } =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code: unknown }).code === "P2002";

const targetIncludes = (target: unknown, column: string) => {
  if (Array.isArray(target)) {
    return target.includes(column);
  }

  return typeof target === "string" && target.includes(column);
};

/**
 * Traduz P2002 para um erro por campo. `attendance_form_id` é a corrida
 * real: dois cadastros simultâneos para a mesma ficha só são barrados
 * pelo índice único, já que a checagem prévia pode passar nos dois.
 */
export const mapCaseUniqueViolation = (error: unknown) => {
  if (!isUniqueViolation(error)) {
    return null;
  }

  const target = error.meta?.target;

  if (targetIncludes(target, "attendance_form_id")) {
    return {
      message: "Esta ficha já possui um processo",
      errors: undefined,
    };
  }

  if (targetIncludes(target, "internal_code")) {
    return {
      message: "Revise os campos informados",
      errors: { internalCode: ["Este código interno já está em uso"] },
    };
  }

  if (targetIncludes(target, "number")) {
    return {
      message: "Revise os campos informados",
      errors: { number: ["Este número de processo já está cadastrado"] },
    };
  }

  return {
    message: "Já existe um processo com estes dados",
    errors: undefined,
  };
};
