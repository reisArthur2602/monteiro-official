"use client";

import { Minus, Plus, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { LegalDocumentPaginatedFrame } from "@/components/shared/documents/legal-document-paginated-frame";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { templateVariableSampleValues } from "../data/template-variables";
import type { TemplateFormValues } from "../types/template-types";
import { resolveDocumentVariables } from "../utils/resolve-document-variables";
import { useTemplateUpsert } from "./template-form-provider";

const PREVIEW_DEBOUNCE_MS = 250;
const MIN_ZOOM = 30;
const MAX_ZOOM = 100;
const ZOOM_STEP = 10;

type TemplatePreviewViewProps = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
};

export const TemplatePreviewView = ({
  zoom,
  onZoomChange,
}: TemplatePreviewViewProps) => {
  const { office } = useTemplateUpsert();
  const { control } = useFormContext<TemplateFormValues>();

  // Observação granular: só estes três ramos disparam recomposição da prévia.
  const [contentHtml, signatures, page] = useWatch({
    control,
    name: ["document.contentHtml", "document.signatures", "document.page"],
  });

  const [resolvedHtml, setResolvedHtml] = useState("");

  useEffect(() => {
    // Sempre resolvido, mesmo com a aba Prévia fechada: a impressão via
    // Ctrl+P do navegador não passa pelo botão "Imprimir" da prévia e pode
    // acontecer com a aba Editar em foco. O cálculo é barato (troca de
    // texto em HTML já pronto), então manter isto fora de um gate por aba
    // é o que garante que o PDF nunca saia vazio ou desatualizado.
    const timeout = setTimeout(() => {
      setResolvedHtml(
        resolveDocumentVariables(
          contentHtml ?? "",
          templateVariableSampleValues,
        ),
      );
    }, PREVIEW_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [contentHtml]);

  // As assinaturas entram na medição da moldura; um array recriado a cada
  // render faria a folha ser remedida a cada passo do zoom sem nenhuma
  // mudança real no documento.
  const resolvedSignatures = useMemo(() => signatures ?? [], [signatures]);

  const zoomOut = () => onZoomChange(Math.max(MIN_ZOOM, zoom - ZOOM_STEP));
  const zoomIn = () => onZoomChange(Math.min(MAX_ZOOM, zoom + ZOOM_STEP));

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
            id="preview-zoom"
            aria-label="Zoom da prévia"
            className="w-24 sm:w-36"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={5}
            value={[zoom]}
            onValueChange={([value]) => onZoomChange(value ?? zoom)}
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

          {/*
            100% aqui corresponde ao tamanho físico real da folha A4 na
            tela: a paginação mede em milímetros convertidos por uma razão
            fixa (96px = 25.4mm), não em pixels do dispositivo.
          */}
          <button
            type="button"
            title="Redefinir para 100%"
            disabled={zoom === MAX_ZOOM}
            onClick={() => onZoomChange(MAX_ZOOM)}
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
            signatures={resolvedSignatures}
            html={resolvedHtml}
            variableValues={templateVariableSampleValues}
          />
        </div>
      </div>
    </section>
  );
};
