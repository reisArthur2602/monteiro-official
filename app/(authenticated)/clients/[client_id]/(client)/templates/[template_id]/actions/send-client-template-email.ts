"use server";

import { getOfficeProfile } from "@/app/(authenticated)/templates/upsert/queries/get-office-profile";
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
import { resolveClientTemplateVariableValues } from "../../utils/resolve-client-template-variables";
import { getClientUsableTemplate } from "../queries/get-client-usable-template";
import { clientTemplateIdSchema } from "../schemas/client-template-id-schema";
import { resolveDocumentVariablesServer } from "../utils/resolve-document-variables-server";

/**
 * Envia o documento — resolvido de novo no servidor a partir da versão
 * publicada, nunca a partir de HTML vindo do navegador — por e-mail para o
 * destinatário informado.
 *
 * Não existe registro persistido deste envio: sem uma tabela de "documento
 * gerado", não há um código, status ou histórico para atualizar depois de
 * enviar. O contrato de retorno já avisa se o envio aconteceu ou não; o que
 * acontece depois com a mensagem (entrega, leitura) fica fora do sistema.
 */
export const sendClientTemplateEmail = async (
  rawClientId: string,
  rawTemplateId: string,
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
    const parsedTemplateId = clientTemplateIdSchema.safeParse(rawTemplateId);

    if (!parsedClientId.success || !parsedTemplateId.success) {
      return { ok: false, message: "Cliente ou modelo inválido" };
    }

    const parsed = sendDocumentEmailSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        message: "Revise os campos informados",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const [client, template, office] = await Promise.all([
      getClientContext(parsedClientId.data),
      getClientUsableTemplate(parsedTemplateId.data),
      getOfficeProfile(),
    ]);

    if (!client || !template) {
      return { ok: false, message: "Cliente ou modelo não encontrado" };
    }

    const variableValues = resolveClientTemplateVariableValues(
      template.usedVariables,
      client,
      office,
    );

    const resolvedDocumentHtml = resolveDocumentVariablesServer(
      template.contentHtml,
      variableValues,
    );

    const emailHtml = buildDocumentEmailHtml({
      message: parsed.data.message,
      documentHtml: resolvedDocumentHtml,
      documentTitle: template.name,
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
