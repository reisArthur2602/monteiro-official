"use client";

import { Save, Settings2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useTemplateUpsert } from "./template-form-provider";

type TemplateMobileActionsProps = {
  onOpenSettings: () => void;
  onOpenPublish: () => void;
};

/**
 * Barra fixa no rodapé em telas pequenas — substitui os botões
 * "Salvar"/"Configurações"/"Publicar" da topbar, escondidos abaixo de `md`.
 * Não inclui "Inserir variável": essa ação mora só na toolbar do editor
 * (`LegalEditorToolbar`), já visível em qualquer largura enquanto o modo
 * Editar estiver ativo.
 */
export const TemplateMobileActions = ({
  onOpenSettings,
  onOpenPublish,
}: TemplateMobileActionsProps) => {
  const { isDirty, isPublishing, save } = useTemplateUpsert();

  const handleSaveClick = async () => {
    const saved = await save();

    // Não há espaço para o texto de estado nesta largura — o toast é o
    // único aviso de que a gravação falhou.
    if (!saved) {
      toast.error("Não foi possível salvar o template");
    }
  };

  return (
    <nav
      aria-label="Ações do template"
      className="sticky bottom-0 z-30 grid grid-cols-3 gap-1.5 border-t bg-card/95 p-2 backdrop-blur-sm md:hidden"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!isDirty || isPublishing}
        onClick={handleSaveClick}
      >
        <Save aria-hidden="true" />
        Salvar
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
