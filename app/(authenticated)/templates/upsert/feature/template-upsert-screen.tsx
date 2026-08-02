"use client";

import { useCallback, useEffect, useState } from "react";

import { DocumentPrintStyles } from "@/components/shared/documents/document-print-styles";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { useLegalEditor } from "../hooks/use-legal-editor";
import type { TemplateView } from "../types/template-types";
import { TemplateEditorView } from "./template-editor-view";
import { TemplateMobileActions } from "./template-mobile-actions";
import { TemplatePreviewView } from "./template-preview-view";
import { TemplatePublishDialog } from "./template-publish-dialog";
import { TemplateSettingsSheet } from "./template-settings-sheet";
import { TemplateTopbar } from "./template-topbar";
import { TemplateVariableDialog } from "./template-variable-dialog";
import { TemplateViewTabs } from "./template-view-tabs";

const DEFAULT_PREVIEW_ZOOM = 70;

export const TemplateUpsertScreen = () => {
  // Estado puramente visual — nada disso pertence ao React Hook Form.
  const [activeView, setActiveView] = useState<TemplateView>("editor");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [variablesOpen, setVariablesOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(DEFAULT_PREVIEW_ZOOM);

  const { editor, syncToForm } = useLegalEditor();

  const openVariables = useCallback(() => setVariablesOpen(true), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const openPublish = useCallback(() => setPublishOpen(true), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "v";

      if (isShortcut) {
        event.preventDefault();
        setVariablesOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="-m-4 flex min-h-[calc(100dvh-4rem)] flex-col sm:-m-6 lg:-m-8">
      <DocumentPrintStyles />

      <TemplateTopbar
        onOpenSettings={openSettings}
        onOpenPublish={openPublish}
      />

      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as TemplateView)}
        className="flex-1 gap-0 px-3 pt-3 pb-4 sm:px-6"
      >
        <TemplateViewTabs />

        {/*
          `forceMount` mantém o editor montado ao alternar para a prévia:
          sem isso, a instância do TipTap seria destruída e a pessoa
          perderia cursor, seleção e histórico de desfazer.
        */}
        <TabsContent value="editor" forceMount hidden={activeView !== "editor"}>
          <TemplateEditorView editor={editor} onOpenVariables={openVariables} />
        </TabsContent>

        <TabsContent
          value="preview"
          forceMount
          hidden={activeView !== "preview"}
          // Alvo da impressão/PDF: precisa renderizar mesmo com a aba
          // Editar em foco, porque Ctrl+P do navegador não passa pelo
          // botão "Imprimir" da prévia. Ver regra `[data-print-root]` em
          // legal-document.css, que sobrepõe o `display: none` do
          // atributo `hidden` somente durante a impressão.
          data-print-root
        >
          <TemplatePreviewView
            zoom={previewZoom}
            onZoomChange={setPreviewZoom}
          />
        </TabsContent>
      </Tabs>

      <TemplateMobileActions onOpenSettings={openSettings} onOpenPublish={openPublish} />

      <TemplateSettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      <TemplateVariableDialog
        editor={editor}
        open={variablesOpen}
        onOpenChange={setVariablesOpen}
        // A inserção é programática e não dispara o evento `update` com o
        // mesmo timing da digitação; sincronizamos na hora.
        onInserted={syncToForm}
      />

      <TemplatePublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </div>
  );
};
