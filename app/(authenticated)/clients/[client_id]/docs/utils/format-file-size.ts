const UNITS = ["B", "KB", "MB", "GB"];

/**
 * Tamanho legível a partir dos bytes gravados. Recebe `number` porque o
 * `BigInt` do Prisma é convertido na query — `BigInt` não é serializável
 * para Client Components.
 */
export const formatFileSize = (bytes: number) => {
  if (bytes <= 0) {
    return "0 B";
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  );

  const value = bytes / 1024 ** exponent;
  const fractionDigits = exponent === 0 || value >= 100 ? 0 : 1;

  return `${value.toFixed(fractionDigits)} ${UNITS[exponent]}`;
};

/** Extensão em maiúsculas, usada como selo do tipo de arquivo no card. */
export const formatFileExtension = (originalName: string) => {
  const extension = originalName.split(".").pop();

  if (!extension || extension === originalName) {
    return "ARQ";
  }

  return extension.slice(0, 4).toUpperCase();
};
