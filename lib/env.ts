import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter pelo menos 32 caracteres"),

  FTP_HOST: z.string().min(1, "FTP_HOST é obrigatória"),
  FTP_PORT: z.coerce.number().int().min(1).max(65535).default(21),
  FTP_USER: z.string().min(1, "FTP_USER é obrigatória"),
  FTP_PASSWORD: z.string().min(1, "FTP_PASSWORD é obrigatória"),

  /**
   * FTPS explícito (AUTH TLS). Só desligue em rede interna confiável:
   * sem TLS, credenciais e arquivos trafegam em texto puro.
   */
  FTP_SECURE: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),

  /**
   * Aceita certificado autoassinado no servidor FTPS. Mantenha `false` em
   * produção — `true` desabilita a verificação da cadeia TLS.
   */
  FTP_REJECT_UNAUTHORIZED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),

  /** Diretório raiz onde os arquivos da aplicação são gravados. */
  FTP_BASE_DIR: z.string().min(1).default("/monteiro"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  FTP_HOST: process.env.FTP_HOST,
  FTP_PORT: process.env.FTP_PORT,
  FTP_USER: process.env.FTP_USER,
  FTP_PASSWORD: process.env.FTP_PASSWORD,
  FTP_SECURE: process.env.FTP_SECURE,
  FTP_REJECT_UNAUTHORIZED: process.env.FTP_REJECT_UNAUTHORIZED,
  FTP_BASE_DIR: process.env.FTP_BASE_DIR,
});
