"use client";

import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { LegalDocumentFrame } from "@/components/shared/documents/legal-document-frame";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { templateVariableSampleValues } from "../data/template-variables";
import type { TemplateFormValues } from "../types/template-types";
import { resolveDocumentVariables } from "../utils/resolve-document-variables";
import { useTemplateUpsert } from "./template-form-provider";

const PREVIEW_DEBOUNCE_MS = 250;

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
    // Ctrl+P do navegador não passa pelo clique no botão "Imprimir" e
    // pode acontecer com a aba Editar em foco. O cálculo é barato (troca
    // de texto em HTML já pronto), então manter isto fora de um gate por
    // aba é o que garante que o PDF nunca saia vazio ou desatualizado.
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
            htmlFor="preview-zoom"
            className="font-mono text-[10px] text-muted-foreground"
          >
            Zoom
          </label>

          <Slider
            id="preview-zoom"
            className="w-28 sm:w-40"
            min={30}
            max={100}
            step={5}
            value={[zoom]}
            onValueChange={([value]) => onZoomChange(value ?? zoom)}
          />

          <span className="w-10 font-mono text-[10px] text-muted-foreground">
            {zoom}%
          </span>
        </div>
      </div>

      <div className="min-h-0 overflow-auto bg-neutral-200 p-3 dark:bg-neutral-800">
        {/* O zoom é puramente visual: a folha mantém as medidas reais de
            A4, para que a impressão e o futuro PDF não sejam afetados.
            `data-print-scale-reset` é o gancho que zera esta transformação
            na impressão. */}
        <div
          data-print-scale-reset
          className="origin-top transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <LegalDocumentFrame
            office={office}
            page={page}
            signatures={signatures ?? []}
            html={resolvedHtml}
            variableValues={templateVariableSampleValues}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
};
