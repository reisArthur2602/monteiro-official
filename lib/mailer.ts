import "server-only";

import { Resend } from "resend";

import { env } from "./env";

/**
 * `RESEND_API_KEY`/`RESEND_FROM_EMAIL` são opcionais em `env.ts` de
 * propósito — enquanto não forem configuradas, a interface desabilita o
 * envio em vez de o app falhar ao iniciar.
 */
export const isMailerConfigured = (): boolean =>
  Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);

let cachedClient: Resend | null = null;

const getClient = (): Resend => {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY não configurada");
  }

  if (!cachedClient) {
    cachedClient = new Resend(env.RESEND_API_KEY);
  }

  return cachedClient;
};

export type SendEmailInput = {
  to: string;
  cc?: string;
  subject: string;
  html: string;
};

export const sendEmail = async (input: SendEmailInput): Promise<void> => {
  if (!isMailerConfigured() || !env.RESEND_FROM_EMAIL) {
    throw new Error("Envio de e-mail não configurado");
  }

  const resend = getClient();

  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.to,
    cc: input.cc,
    subject: input.subject,
    html: input.html,
  });

  if (error) {
    throw new Error(error.message);
  }
};
