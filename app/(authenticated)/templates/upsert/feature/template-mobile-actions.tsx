"use client";

import { Braces, Settings2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTemplateUpsert } from "./template-form-provider";

type TemplateMobileActionsProps = {
  onOpenVariables: () => void;
  onOpenSettings: () => void;
  onOpenPublish: () => void;
};

/**
 * Barra fixa no rodapé em telas pequenas.
 *
 * Não duplica lógica: recebe exatamente os mesmos callbacks usados pelos
 * botões da topbar e da barra de modos.
 */
export const TemplateMobileActions = ({
  onOpenVariables,
  onOpenSettings,
  onOpenPublish,
}: TemplateMobileActionsProps) => {
  const { isPublishing } = useTemplateUpsert();

  return (
    <nav
      aria-label="Ações do template"
      className="sticky bottom-0 z-30 grid grid-cols-3 gap-1.5 border-t bg-card/95 p-2 backdrop-blur-sm md:hidden"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onOpenVariables}
      >
        <Braces aria-hidden="true" />
        Variável
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onOpenSettings}
      >
        <Settings2 aria-hidden="true" />
        Config.
      </Button>

      <Button
        type="button"
        size="sm"
        disabled={isPublishing}
        onClick={onOpenPublish}
      >
        <Upload aria-hidden="true" />
        {isPublishing ? "…" : "Publicar"}
      </Button>
    </nav>
  );
};
