"use client";

import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { LegalRichTextEditor } from "../editor/legal-editor";
import { LegalEditorToolbar } from "../editor/legal-editor-toolbar";
import { useTemplateUpsert } from "./template-form-provider";

type TemplateEditorViewProps = {
  editor: Editor | null;
  onOpenVariables: () => void;
};

export const TemplateEditorView = ({
  editor,
  onOpenVariables,
}: TemplateEditorViewProps) => {
  const { currentVersion, status } = useTemplateUpsert();

  const wordCount = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      if (!instance) {
        return 0;
      }

      const text = instance.getText().trim();

      return text ? text.split(/\s+/).length : 0;
    },
  });

  return (
    <section className="grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-xl border bg-card shadow-sm">
      <LegalEditorToolbar editor={editor} onInsertVariable={onOpenVariables} />

      <div className="min-h-0 overflow-auto bg-background p-2 sm:p-6 lg:p-8">
        <LegalRichTextEditor editor={editor} />
      </div>

      <footer className="flex min-h-11 items-center justify-between gap-4 border-t px-3 font-mono text-[10px] text-muted-foreground">
        <span>
          {wordCount ?? 0} {wordCount === 1 ? "palavra" : "palavras"}
        </span>

        <span>
          {status === "ATIVO" ? "Publicado" : "Rascunho"}
          {currentVersion > 0 ? ` · versão ${currentVersion}` : " · sem versão"}
        </span>
      </footer>
    </section>
  );
};
