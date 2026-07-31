"use client";

import { Printer } from "lucide-react";
import { useState } from "react";

import { DocumentSignatures } from "@/components/shared/documents/document-signatures";
import { InstitutionalFooter } from "@/components/shared/documents/institutional-footer";
import { InstitutionalHeader } from "@/components/shared/documents/institutional-header";
import { LegalDocumentPage } from "@/components/shared/documents/legal-document-page";
import "@/components/shared/documents/legal-document.css";
import type {
  DocumentPageSettings,
  OfficeProfile,
} from "@/components/shared/documents/document-types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { formatDocument } from "../../../../utils/format-document";
import { formatPhone } from "../../../../utils/format-phone";
import type { ClientContext } from "../../../queries/get-client-context";
import { attendanceChannelLabels } from "../../../utils/attendance-form-labels";
import { formatAddressLines } from "../../../utils/format-address";
import { attendanceActionLabels } from "../../upsert/data/attendance-action-catalog";
import type { AttendanceFormDetail } from "../queries/get-attendance-form-detail";
import { formatDateTime } from "../utils/format-datetime";

const PAGE_SETTINGS: DocumentPageSettings = {
  format: "A4",
  orientation: "PORTRAIT",
  marginTop: 20,
  marginRight: 18,
  marginBottom: 18,
  marginLeft: 18,
  showInstitutionalHeader: true,
  showInstitutionalFooter: true,
  city: "",
};

const LABEL_GRAY = "#656c69";
const BORDER_GRAY = "#d7dcda";

type DocSectionProps = { title: string; children: React.ReactNode };

const DocSection = ({ title, children }: DocSectionProps) => (
  <section className="mt-[8mm]">
    <h2
      className="mb-[3mm] border-b pb-[2mm] text-[11pt] uppercase"
      style={{ borderColor: BORDER_GRAY }}
    >
      {title}
    </h2>

    {children}
  </section>
);

type DocDataItemProps = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

const DocDataItem = ({ label, value, fullWidth }: DocDataItemProps) => (
  <div className={fullWidth ? "col-span-2 grid gap-[1mm]" : "grid gap-[1mm]"}>
    <span
      className="font-sans text-[7.5pt] font-bold uppercase"
      style={{ color: LABEL_GRAY }}
    >
      {label}
    </span>

    <strong className="text-[10pt] font-semibold">{value}</strong>
  </div>
);

const paragraphs = (text: string | null) =>
  (text ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

type AttendanceDocumentPreviewProps = {
  office: OfficeProfile;
  client: ClientContext;
  form: AttendanceFormDetail;
};

/**
 * Documento A4 da ficha, montado sobre `LegalDocumentPage` diretamente —
 * não sobre `LegalDocumentFrame`, porque o conteúdo aqui é estruturado
 * (campos e listas), não HTML rico de editor. O comentário de
 * `LegalDocumentFrame` já previa este uso por "fichas".
 */
export const AttendanceDocumentPreview = ({
  office,
  client,
  form,
}: AttendanceDocumentPreviewProps) => {
  const [zoom, setZoom] = useState(85);

  const subject = form.subject || "Ficha sem assunto";
  const documentLabel = client.type === "PESSOA_FISICA" ? "CPF" : "CNPJ";
  const addressLine = formatAddressLines(client.address).join(", ");

  // Sem contato designado, a linha de assinatura do cliente cai para o
  // próprio nome do cliente — nunca fica sem nome nenhum.
  const clientSignerName =
    form.contactPerson || client.displayName || client.name;

  return (
    <section className="grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => window.print()}
        >
          <Printer aria-hidden="true" />
          Imprimir
        </Button>

        <div className="flex items-center gap-3">
          <label
            htmlFor="attendance-preview-zoom"
            className="font-mono text-[10px] text-muted-foreground"
          >
            Zoom
          </label>

          <Slider
            id="attendance-preview-zoom"
            className="w-28 sm:w-40"
            min={40}
            max={110}
            step={5}
            value={[zoom]}
            onValueChange={([value]) => setZoom(value ?? zoom)}
          />

          <span className="w-10 font-mono text-[10px] text-muted-foreground">
            {zoom}%
          </span>
        </div>
      </div>

      <div className="min-h-0 overflow-auto bg-neutral-200 p-3 dark:bg-neutral-800">
        {/* Zoom é só visual — a folha mantém as medidas reais de A4, e
            `data-print-scale-reset` zera esta transformação na impressão. */}
        <div
          data-print-scale-reset
          className="origin-top transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <LegalDocumentPage page={PAGE_SETTINGS} className="mx-auto">
            <InstitutionalHeader office={office} />

            <h1 className="mt-[11mm] mb-[8mm] text-center text-[15pt] uppercase">
              Ficha de atendimento
            </h1>

            <section
              className="mb-[9mm] grid grid-cols-2 gap-[3mm_8mm] border p-[5mm]"
              style={{ borderColor: BORDER_GRAY, background: "#fafbf9" }}
            >
              <DocDataItem
                label="Data e horário"
                value={formatDateTime(form.attendanceAt)}
              />

              <DocDataItem
                label="Canal"
                value={
                  form.channel ? attendanceChannelLabels[form.channel] : "—"
                }
              />

              <DocDataItem label="Responsável" value={form.responsible.name} />
              <DocDataItem
                label="Área jurídica"
                value={form.legalArea || "—"}
              />
            </section>

            <DocSection title="Contexto cadastral do cliente">
              <div className="grid grid-cols-2 gap-[3mm_8mm]">
                <DocDataItem
                  label={
                    client.type === "PESSOA_FISICA"
                      ? "Nome completo"
                      : "Razão social"
                  }
                  value={client.name}
                />

                <DocDataItem
                  label="Nome social/fantasia"
                  value={client.displayName || "—"}
                />

                <DocDataItem
                  label={documentLabel}
                  value={formatDocument(client.document)}
                />

                <DocDataItem
                  label="Pessoa de contato"
                  value={form.contactPerson || "—"}
                />

                <DocDataItem label="E-mail" value={client.email || "—"} />

                <DocDataItem
                  label="Telefone"
                  value={client.phone ? formatPhone(client.phone) : "—"}
                />

                <DocDataItem
                  label="Endereço"
                  value={addressLine || "Não informado"}
                  fullWidth
                />
              </div>
            </DocSection>

            <DocSection title="Assunto principal">
              <p>{subject}</p>
            </DocSection>

            <DocSection title="Relato do cliente">
              {paragraphs(form.clientReport).length > 0 ? (
                paragraphs(form.clientReport).map((line) => (
                  <p key={line}>{line}</p>
                ))
              ) : (
                <p>Nenhum relato registrado.</p>
              )}
            </DocSection>

            <DocSection title="Análise preliminar do caso">
              {paragraphs(form.preliminaryAnalysis).length > 0 ? (
                paragraphs(form.preliminaryAnalysis).map((line) => (
                  <p key={line}>{line}</p>
                ))
              ) : (
                <p>Nenhuma análise registrada.</p>
              )}
            </DocSection>

            {form.actions.length > 0 ? (
              <DocSection title="Ações e encaminhamentos definidos">
                <ul>
                  {form.actions.map((action) => (
                    <li key={action.type}>
                      {attendanceActionLabels[action.type]}
                    </li>
                  ))}
                </ul>
              </DocSection>
            ) : null}

            <DocumentSignatures
              signatures={[
                {
                  label: "Cliente",
                  nameSource: "FIXED",
                  fixedName: clientSignerName,
                  role: "Representante do cliente",
                },
                {
                  label: "Responsável",
                  nameSource: "FIXED",
                  fixedName: form.responsible.name,
                  role: "Responsável pelo atendimento",
                },
              ]}
            />

            <p
              className="mt-[4mm] text-center font-sans text-[7pt]"
              style={{ color: LABEL_GRAY }}
            >
              Ficha nº {form.id.slice(0, 8).toUpperCase()}
            </p>

            <InstitutionalFooter office={office} city={PAGE_SETTINGS.city} />
          </LegalDocumentPage>
        </div>
      </div>
    </section>
  );
};
