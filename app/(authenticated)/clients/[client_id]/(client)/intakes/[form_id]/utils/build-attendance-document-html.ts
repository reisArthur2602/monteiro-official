import { formatDocument } from "@/app/(authenticated)/clients/utils/format-document";
import { formatPhone } from "@/app/(authenticated)/clients/utils/format-phone";

import type { ClientContext } from "../../../queries/get-client-context";
import { attendanceChannelLabels } from "../../../utils/attendance-form-labels";
import { formatAddressLines } from "../../../utils/format-address";
import { attendanceActionLabels } from "../../upsert/data/attendance-action-catalog";
import type { AttendanceFormDetail } from "../queries/get-attendance-form-detail";
import { formatDateTime } from "./format-datetime";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const LABEL_GRAY = "#656c69";
const BORDER_GRAY = "#d7dcda";

const field = (label: string, value: string) => `
  <div style="margin-bottom:10px;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;color:${LABEL_GRAY};">${escapeHtml(label)}</div>
    <div style="font-size:13px;font-weight:600;">${escapeHtml(value)}</div>
  </div>
`;

const sectionTitle = (title: string) => `
  <h2 style="margin:20px 0 10px;padding-bottom:6px;border-bottom:1px solid ${BORDER_GRAY};font-size:13px;text-transform:uppercase;">
    ${escapeHtml(title)}
  </h2>
`;

const splitParagraphs = (text: string | null) =>
  (text ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const textSection = (
  title: string,
  text: string | null,
  emptyMessage: string,
) => {
  const lines = splitParagraphs(text);

  const body =
    lines.length > 0
      ? lines
          .map((line) => `<p style="margin:0 0 8px;">${escapeHtml(line)}</p>`)
          .join("")
      : `<p style="margin:0;">${escapeHtml(emptyMessage)}</p>`;

  return `${sectionTitle(title)}${body}`;
};

/**
 * Mesmo conteúdo de `AttendanceDocumentPreview`, mas como HTML plano para o
 * corpo de um e-mail — sem paginação A4 (e-mail não tem folha física) e sem
 * grade CSS (muitos clientes de e-mail, sobretudo Outlook, não renderizam
 * `display: grid` de forma confiável).
 */
export const buildAttendanceDocumentHtml = (
  client: ClientContext,
  form: AttendanceFormDetail,
): string => {
  const documentLabel = client.type === "PESSOA_FISICA" ? "CPF" : "CNPJ";
  const addressLine = formatAddressLines(client.address).join(", ");

  const clientSignerName =
    form.contactPerson || client.displayName || client.name;

  return `
    <h1 style="margin:0 0 16px;text-align:center;text-transform:uppercase;font-size:16px;">
      Ficha de atendimento
    </h1>

    ${field("Data e horário", formatDateTime(form.attendanceAt))}
    ${field("Canal", form.channel ? attendanceChannelLabels[form.channel] : "—")}
    ${field("Responsável", form.responsible.name)}
    ${field("Área jurídica", form.legalArea || "—")}

    ${sectionTitle("Contexto cadastral do cliente")}
    ${field(client.type === "PESSOA_FISICA" ? "Nome completo" : "Razão social", client.name)}
    ${field("Nome social/fantasia", client.displayName || "—")}
    ${field(documentLabel, formatDocument(client.document))}
    ${field("Pessoa de contato", form.contactPerson || "—")}
    ${field("E-mail", client.email || "—")}
    ${field("Telefone", client.phone ? formatPhone(client.phone) : "—")}
    ${field("Endereço", addressLine || "Não informado")}

    ${sectionTitle("Assunto principal")}
    <p style="margin:0;">${escapeHtml(form.subject || "Ficha sem assunto")}</p>

    ${textSection("Relato do cliente", form.clientReport, "Nenhum relato registrado.")}
    ${textSection("Análise preliminar do caso", form.preliminaryAnalysis, "Nenhuma análise registrada.")}

    ${
      form.actions.length > 0
        ? `${sectionTitle("Ações e encaminhamentos definidos")}<ul style="margin:0;padding-left:18px;">${form.actions
            .map(
              (action) =>
                `<li style="margin-bottom:4px;">${escapeHtml(attendanceActionLabels[action.type])}</li>`,
            )
            .join("")}</ul>`
        : ""
    }

    <table style="width:100%;margin-top:32px;border-collapse:collapse;">
      <tr>
        <td style="width:50%;padding-top:8px;border-top:1px solid #17201d;text-align:center;font-size:11px;">
          <strong style="display:block;">${escapeHtml(clientSignerName)}</strong>
          Representante do cliente
        </td>
        <td style="width:50%;padding-top:8px;border-top:1px solid #17201d;text-align:center;font-size:11px;">
          <strong style="display:block;">${escapeHtml(form.responsible.name)}</strong>
          Responsável pelo atendimento
        </td>
      </tr>
    </table>

    <p style="margin:16px 0 0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:${LABEL_GRAY};">
      Ficha nº ${form.id.slice(0, 8).toUpperCase()}
    </p>
  `;
};
