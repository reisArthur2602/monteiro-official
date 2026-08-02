"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { TemplateFormValues } from "../types/template-types";

/**
 * Só o seletor de modo (Editar/Prévia) e o estado de variáveis usadas.
 *
 * "Inserir variável" mora só na toolbar do editor (`LegalEditorToolbar`),
 * dentro do `TabsContent` de Editar — nesta barra ela ficava visível também
 * na Prévia. "Configurações" mora só no cabeçalho do recurso
 * (`TemplateTopbar`) — aqui ela duplicava o mesmo botão.
 */
export const TemplateViewTabs = () => {
  const { control } = useFormContext<TemplateFormValues>();

  // Observação granular: só a contagem de variáveis re-renderiza a barra.
  const usedVariables = useWatch({
    control,
    name: "document.usedVariables",
  });

  const usedCount = usedVariables?.length ?? 0;

  return (
    <div className="sticky top-14 z-20 mb-4 flex min-h-12 items-center justify-between gap-4 rounded-xl border bg-card/95 p-1.5 backdrop-blur-sm">
      <TabsList className="shrink-0">
        <TabsTrigger value="editor" className="data-active:text-primary data-active:font-semibold">
          Editar
        </TabsTrigger>

        <TabsTrigger
          value="preview"
          className="data-active:text-primary data-active:font-semibold"
        >
          Prévia
        </TabsTrigger>
      </TabsList>

      <span className="hidden font-mono text-[10px] text-muted-foreground lg:inline">
        {usedCount} {usedCount === 1 ? "variável usada" : "variáveis usadas"}
      </span>
    </div>
  );
};
