"use client";

import { Printer } from "lucide-react";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import { formatDocument } from "@/app/(authenticated)/clients/utils/format-document";
import { formatPhone } from "@/app/(authenticated)/clients/utils/format-phone";
import type {
  DocumentPageSettings,
  DocumentSignature,
  OfficeProfile,
} from "@/components/shared/documents/document-types";
import { LegalDocumentBlocksFrame } from "@/components/shared/documents/legal-document-blocks-frame";
import "@/components/shared/documents/legal-document.css";
import type { DocumentBlock } from "@/components/shared/documents/use-paginated-blocks";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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

const MIN_ZOOM = 40;
const MAX_ZOOM = 110;

const LABEL_GRAY = "#656c69";
const BORDER_GRAY = "#d7dcda";

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

/**
 * Título de seção.
 *
 * A `<section>` que antes envolvia título e corpo saiu: o paginador move
 * blocos irmãos entre folhas, e um corpo preso dentro do mesmo elemento do
 * título só poderia mudar de página inteiro. Sem o wrapper, a margem
 * superior passa para o próprio título e o corpo flui livremente — o
 * `keepWithNext` do bloco é que garante que o título nunca fique sozinho no
 * pé da página.
 */
const DocSectionTitle = ({ children }: { children: string }) => (
  <h2
    className="mt-[8mm] mb-[3mm] border-b pb-[2mm] text-[11pt] uppercase"
    style={{ borderColor: BORDER_GRAY }}
  >
    {children}
  </h2>
);

const splitParagraphs = (text: string | null) =>
  (text ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * Um título de seção mais o corpo dela, já como blocos independentes.
 *
 * Cada parágrafo é um bloco próprio: é o que permite um relato longo
 * atravessar várias folhas sem que nenhum parágrafo seja cortado ao meio.
 */
const buildTextSection = (
  key: string,
  title: string,
  text: string | null,
  emptyMessage: string,
): DocumentBlock[] => {
  const lines = splitParagraphs(text);

  return [
    {
      id: `${key}-title`,
      keepWithNext: true,
      content: <DocSectionTitle>{title}</DocSectionTitle>,
    },
    ...(lines.length > 0
      ? lines.map((line, index) => ({
          id: `${key}-${index}`,
          content: <p>{line}</p>,
        }))
      : [{ id: `${key}-empty`, content: <p>{emptyMessage}</p> }]),
  ];
};

type AttendanceDocumentPreviewProps = {
  office: OfficeProfile;
  client: ClientContext;
  form: AttendanceFormDetail;
};

/**
 * Documento A4 da ficha de atendimento, dividido automaticamente em quantas
 * folhas o conteúdo exigir.
 *
 * O conteúdo é descrito como blocos indivisíveis em vez de HTML porque aqui
 * ele é estruturado — campos, grades e listas —, não texto rico de editor.
 * `LegalDocumentBlocksFrame` cuida da medição, da quebra e da moldura, com o
 * mesmo comportamento da prévia de templates.
 */
export const AttendanceDocumentPreview = ({
  office,
  client,
  form,
}: AttendanceDocumentPreviewProps) => {
  const [zoom, setZoom] = useState(85);

  // Estável entre renders de propósito: o zoom não pode invalidar a
  // medição dos blocos, que é feita em milímetros reais e não muda com a
  // escala exibida na tela.
  const blocks = useMemo<DocumentBlock[]>(() => {
    const documentLabel = client.type === "PESSOA_FISICA" ? "CPF" : "CNPJ";
    const addressLine = formatAddressLines(client.address).join(", ");

    return [
      {
        id: "title",
        keepWithNext: true,
        content: (
          <h1 className="mt-[11mm] mb-[8mm] text-center text-[15pt] uppercase">
            Ficha de atendimento
          </h1>
        ),
      },
      {
        id: "summary",
        content: (
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
              value={form.channel ? attendanceChannelLabels[form.channel] : "—"}
            />

            <DocDataItem label="Responsável" value={form.responsible.name} />
            <DocDataItem label="Área jurídica" value={form.legalArea || "—"} />
          </section>
        ),
      },
      {
        id: "registry-title",
        keepWithNext: true,
        content: (
          <DocSectionTitle>Contexto cadastral do cliente</DocSectionTitle>
        ),
      },
      {
        id: "registry-grid",
        content: (
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
        ),
      },
      {
        id: "subject-title",
        keepWithNext: true,
        content: <DocSectionTitle>Assunto principal</DocSectionTitle>,
      },
      {
        id: "subject-body",
        content: <p>{form.subject || "Ficha sem assunto"}</p>,
      },
      ...buildTextSection(
        "report",
        "Relato do cliente",
        form.clientReport,
        "Nenhum relato registrado.",
      ),
      ...buildTextSection(
        "analysis",
        "Análise preliminar do caso",
        form.preliminaryAnalysis,
        "Nenhuma análise registrada.",
      ),
      ...(form.actions.length > 0
        ? [
            {
              id: "actions-title",
              keepWithNext: true,
              content: (
                <DocSectionTitle>
                  Ações e encaminhamentos definidos
                </DocSectionTitle>
              ),
            },
            {
              id: "actions-list",
              content: (
                <ul>
                  {form.actions.map((action) => (
                    <li key={action.type}>
                      {attendanceActionLabels[action.type]}
                    </li>
                  ))}
                </ul>
              ),
            },
          ]
        : []),
    ];
  }, [client, form]);

  // Assinaturas e fecho também entram na medição da folha; recriá-los a cada
  // render faria a moldura ser remedida a cada passo do zoom sem nenhuma
  // mudança real.
  const signatures = useMemo<DocumentSignature[]>(
    () => [
      {
        label: "Cliente",
        nameSource: "FIXED",
        // Sem contato designado, a linha de assinatura do cliente cai para o
        // próprio nome do cliente — nunca fica sem nome nenhum.
        fixedName: form.contactPerson || client.displayName || client.name,
        role: "Representante do cliente",
      },
      {
        label: "Responsável",
        nameSource: "FIXED",
        fixedName: form.responsible.name,
        role: "Responsável pelo atendimento",
      },
    ],
    [client, form],
  );

  const closing = useMemo<ReactElement>(
    () => (
      <p
        className="mt-[4mm] text-center font-sans text-[7pt]"
        style={{ color: LABEL_GRAY }}
      >
        Ficha nº {form.id.slice(0, 8).toUpperCase()}
      </p>
    ),
    [form.id],
  );

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
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={5}
            value={[zoom]}
            onValueChange={([value]) => setZoom(value ?? zoom)}
          />

          <span className="w-10 font-mono text-[10px] text-muted-foreground">
            {zoom}%
          </span>
        </div>
      </div>

      <div className="min-h-0 overflow-auto bg-neutral-200 p-6 dark:bg-neutral-800">
        {/* Zoom é só visual — as folhas mantêm as medidas reais de A4, e
            `data-print-scale-reset` zera esta transformação na impressão. */}
        <div
          data-print-scale-reset
          className="origin-top transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <LegalDocumentBlocksFrame
            office={office}
            page={PAGE_SETTINGS}
            blocks={blocks}
            closing={closing}
            signatures={signatures}
          />
        </div>
      </div>
    </section>
  );
};
