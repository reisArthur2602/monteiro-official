"use client";

import { Settings2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTemplateUpsert } from "./template-form-provider";

type TemplateMobileActionsProps = {
  onOpenSettings: () => void;
  onOpenPublish: () => void;
};

/**
 * Barra fixa no rodapé em telas pequenas — substitui os botões
 * "Configurações"/"Publicar" da topbar, escondidos abaixo de `md`. Não
 * inclui "Inserir variável": essa ação mora só na toolbar do editor
 * (`LegalEditorToolbar`), já visível em qualquer largura enquanto o modo
 * Editar estiver ativo.
 */
export const TemplateMobileActions = ({
  onOpenSettings,
  onOpenPublish,
}: TemplateMobileActionsProps) => {
  const { isPublishing } = useTemplateUpsert();

  return (
    <nav
      aria-label="Ações do template"
      className="sticky bottom-0 z-30 grid grid-cols-2 gap-1.5 border-t bg-card/95 p-2 backdrop-blur-sm md:hidden"
    >
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
