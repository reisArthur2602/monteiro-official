"use client";

import { Minus, Plus, Printer } from "lucide-react";
import { useMemo, useState } from "react";

import { LegalDocumentPaginatedFrame } from "@/components/shared/documents/legal-document-paginated-frame";
import "@/components/shared/documents/legal-document.css";

import { resolveDocumentVariables } from "@/app/(authenticated)/templates/upsert/utils/resolve-document-variables";
import type {
  DocumentPageSettings,
  DocumentSignature,
  OfficeProfile,
} from "@/components/shared/documents/document-types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const MIN_ZOOM = 30;
const MAX_ZOOM = 100;
const ZOOM_STEP = 10;

type ClientTemplatePreviewProps = {
  office: OfficeProfile;
  page: DocumentPageSettings;
  signatures: DocumentSignature[];
  contentHtml: string;
  variableValues: Record<string, string>;
};

/**
 * Prévia somente leitura de um modelo já preenchido com os dados reais do
 * cliente. Sem edição: quem quiser mudar o conteúdo do modelo em si edita o
 * template em `/templates/upsert`, não aqui.
 */
export const ClientTemplatePreview = ({
  office,
  page,
  signatures,
  contentHtml,
  variableValues,
}: ClientTemplatePreviewProps) => {
  const [zoom, setZoom] = useState(85);

  // O conteúdo não muda depois de carregado — resolver uma vez basta, sem o
  // debounce que a prévia do editor precisa para acompanhar digitação.
  const resolvedHtml = useMemo(
    () => resolveDocumentVariables(contentHtml, variableValues),
    [contentHtml, variableValues],
  );

  const zoomOut = () =>
    setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP));
  const zoomIn = () =>
    setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP));

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

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Diminuir zoom"
            disabled={zoom <= MIN_ZOOM}
            onClick={zoomOut}
          >
            <Minus aria-hidden="true" />
          </Button>

          <Slider
            id="client-template-zoom"
            aria-label="Zoom da prévia"
            className="w-24 sm:w-36"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={5}
            value={[zoom]}
            onValueChange={([value]) => setZoom(value ?? zoom)}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Aumentar zoom"
            disabled={zoom >= MAX_ZOOM}
            onClick={zoomIn}
          >
            <Plus aria-hidden="true" />
          </Button>

          <button
            type="button"
            title="Redefinir para 100%"
            disabled={zoom === MAX_ZOOM}
            onClick={() => setZoom(MAX_ZOOM)}
            className="w-10 rounded font-mono text-[10px] text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            {zoom}%
          </button>
        </div>
      </div>

      <div className="min-h-0 overflow-auto bg-neutral-200 p-6 dark:bg-neutral-800">
        <div
          data-print-scale-reset
          className="origin-top transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <LegalDocumentPaginatedFrame
            office={office}
            page={page}
            signatures={signatures}
            html={resolvedHtml}
            variableValues={variableValues}
          />
        </div>
      </div>
    </section>
  );
};
