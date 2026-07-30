"use client";

import { Braces, Settings2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { TemplateFormValues } from "../types/template-types";

type TemplateViewTabsProps = {
  onOpenVariables: () => void;
  onOpenSettings: () => void;
};

export const TemplateViewTabs = ({
  onOpenVariables,
  onOpenSettings,
}: TemplateViewTabsProps) => {
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
        <TabsTrigger value="editor">Editar</TabsTrigger>
        <TabsTrigger value="preview">Prévia</TabsTrigger>
      </TabsList>

      <div className="flex items-center gap-2">
        <span className="hidden font-mono text-[10px] text-muted-foreground lg:inline">
          {usedCount} {usedCount === 1 ? "variável usada" : "variáveis usadas"}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden md:inline-flex"
          onClick={onOpenVariables}
        >
          <Braces aria-hidden="true" />
          Inserir variável
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden lg:inline-flex"
          onClick={onOpenSettings}
        >
          <Settings2 aria-hidden="true" />
          Configurações
        </Button>
      </div>
    </div>
  );
};
