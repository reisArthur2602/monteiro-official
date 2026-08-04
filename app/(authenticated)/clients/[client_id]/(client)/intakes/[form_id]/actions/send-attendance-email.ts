"use server";

import { buildDocumentEmailHtml } from "@/components/shared/documents/build-document-email-html";
import { isMailerConfigured, sendEmail } from "@/lib/mailer";
import {
  type SendDocumentEmailInput,
  sendDocumentEmailSchema,
} from "@/schemas/document-email/send-document-email-schema";
import type { ActionResult } from "@/utils";
import { verifyAuth } from "@/utils/auth";

import { getClientContext } from "../../../queries/get-client-context";
import { clientIdSchema } from "../../../schemas/client-id-schema";
import { getAttendanceFormDetail } from "../queries/get-attendance-form-detail";
import { formIdSchema } from "../schemas/form-id-schema";
import { buildAttendanceDocumentHtml } from "../utils/build-attendance-document-html";

/**
 * Envia a ficha por e-mail — reconstruída no servidor a partir dos dados
 * atuais do cliente e da ficha, nunca a partir de HTML vindo do navegador.
 *
 * Sem registro persistido do envio, igual ao envio de templates: o contrato
 * de retorno já avisa se aconteceu ou não, e não há histórico para
 * atualizar depois.
 */
export const sendAttendanceEmail = async (
  rawClientId: string,
  rawFormId: string,
  input: SendDocumentEmailInput,
): Promise<ActionResult<null>> => {
  try {
    await verifyAuth();

    if (!isMailerConfigured()) {
      return {
        ok: false,
        message: "O envio de e-mail ainda não foi configurado",
      };
    }

    const parsedClientId = clientIdSchema.safeParse(rawClientId);
    const parsedFormId = formIdSchema.safeParse(rawFormId);

    if (!parsedClientId.success || !parsedFormId.success) {
      return { ok: false, message: "Cliente ou ficha inválida" };
    }

    const parsed = sendDocumentEmailSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const [client, form] = await Promise.all([
      getClientContext(parsedClientId.data),
      getAttendanceFormDetail(parsedClientId.data, parsedFormId.data),
    ]);

    if (!client || !form) {
      return { ok: false, message: "Cliente ou ficha não encontrada" };
    }

    const emailHtml = buildDocumentEmailHtml({
      message: parsed.data.message,
      documentHtml: buildAttendanceDocumentHtml(client, form),
      documentTitle: form.subject || "Ficha de atendimento",
    });

    await sendEmail({
      to: parsed.data.to,
      cc: parsed.data.cc || undefined,
      subject: parsed.data.subject,
      html: emailHtml,
    });

    return {
      ok: true,
      message: "E-mail enviado com sucesso",
      data: null,
    };
  } catch {
    return {
      ok: false,
      message: "Não foi possível enviar o e-mail",
    };
  }
};
