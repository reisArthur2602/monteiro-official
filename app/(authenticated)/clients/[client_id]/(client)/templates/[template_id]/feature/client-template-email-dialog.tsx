"use client";

import { DocumentEmailDialog } from "@/components/shared/documents/document-email-dialog";
import type { SendDocumentEmailInput } from "@/schemas/document-email/send-document-email-schema";

import { sendClientTemplateEmail } from "../actions/send-client-template-email";

type ClientTemplateEmailDialogProps = {
  clientId: string;
  templateId: string;
  templateName: string;
  clientName: string;
  clientEmail: string | null;
};

export const ClientTemplateEmailDialog = ({
  clientId,
  templateId,
  templateName,
  clientName,
  clientEmail,
}: ClientTemplateEmailDialogProps) => (
  <DocumentEmailDialog
    documentName={templateName}
    hasClientEmail={Boolean(clientEmail)}
    defaultValues={{
      to: clientEmail ?? "",
      cc: "",
      subject: `${templateName} — ${clientName}`,
      message: `Olá,\n\nSegue abaixo o documento "${templateName}" preparado para ${clientName}.\n\nAtenciosamente.`,
    }}
    sendAction={(values: SendDocumentEmailInput) =>
      sendClientTemplateEmail(clientId, templateId, values)
    }
  />
);
