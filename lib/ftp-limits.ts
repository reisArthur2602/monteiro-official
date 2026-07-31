/**
 * Limites de upload compartilhados entre servidor e interface.
 *
 * Vivem fora de `lib/ftp.ts` porque aquele módulo é `server-only`: o
 * formulário precisa do limite e da lista de extensões, mas não pode
 * carregar o cliente FTP nem as credenciais junto.
 */

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/**
 * Extensões aceitas. A lista é curta de propósito: qualquer formato
 * executável ou interpretável pelo servidor fica de fora.
 */
export const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".odt",
  ".ods",
  ".txt",
  ".rtf",
  ".csv",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".heic",
  ".zip",
] as const;

/**
 * O MIME declarado pelo navegador é apenas um indício — a extensão
 * normalizada é o que decide o nome gravado. O servidor confere ambos.
 */
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/rtf",
  "application/zip",
  "text/plain",
  "text/csv",
  "text/rtf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
] as const;

/** Valor do `accept` do input — conveniência de interface, não proteção. */
export const UPLOAD_ACCEPT_ATTRIBUTE = ALLOWED_EXTENSIONS.join(",");
