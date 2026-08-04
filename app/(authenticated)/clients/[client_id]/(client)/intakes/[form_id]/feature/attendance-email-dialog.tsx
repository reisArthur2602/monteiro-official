"use client";

import { DocumentEmailDialog } from "@/components/shared/documents/document-email-dialog";
import type { SendDocumentEmailInput } from "@/schemas/document-email/send-document-email-schema";

import { sendAttendanceEmail } from "../actions/send-attendance-email";

type AttendanceEmailDialogProps = {
  clientId: string;
  formId: string;
  subject: string;
  clientName: string;
  clientEmail: string | null;
  /** `"w-full"` no painel de ações da ficha, que empilha botões de largura cheia. */
  triggerClassName?: string;
};

export const AttendanceEmailDialog = ({
  clientId,
  formId,
  subject,
  clientName,
  clientEmail,
  triggerClassName,
}: AttendanceEmailDialogProps) => (
  <DocumentEmailDialog
    documentName={subject}
    hasClientEmail={Boolean(clientEmail)}
    triggerClassName={triggerClassName}
    defaultValues={{
      to: clientEmail ?? "",
      cc: "",
      subject: `${subject} — ${clientName}`,
      message: `Olá,\n\nSegue abaixo a ficha de atendimento "${subject}" referente a ${clientName}.\n\nAtenciosamente.`,
    }}
    sendAction={(values: SendDocumentEmailInput) =>
      sendAttendanceEmail(clientId, formId, values)
    }
  />
);
