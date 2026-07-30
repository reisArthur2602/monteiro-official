"use client";

import type { JSONContent } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { legalEditorExtensions } from "../editor/legal-editor-extensions";
import type { TemplateFormValues } from "../types/template-types";
import { extractUsedVariables } from "../utils/document-content";

/** Curto o bastante para a prévia acompanhar, longo o bastante para não
 *  disparar um setValue por tecla digitada. */
const SYNC_DEBOUNCE_MS = 200;

/**
 * Cria a instância do TipTap e a mantém fora do React Hook Form.
 *
 * O JSON é a fonte de verdade; HTML e lista de variáveis são derivados dele
 * a cada sincronização. O formulário recebe apenas o resultado, com
 * `shouldValidate: false` para não revalidar o documento inteiro enquanto
 * a pessoa digita.
 */
export const useLegalEditor = () => {
  const { setValue, getValues } = useFormContext<TemplateFormValues>();

  const initialContentRef = useRef<JSONContent>(
    getValues("document.contentJson") as JSONContent,
  );
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: legalEditorExtensions,
    content: initialContentRef.current,
    // Evita divergência de hidratação entre servidor e cliente no App Router.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "legal-document legal-document--editable",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Conteúdo do documento",
      },
    },
  });

  const syncToForm = useCallback(() => {
    if (!editor) {
      return;
    }

    const contentJson = editor.getJSON() as Record<string, unknown>;

    setValue("document.contentJson", contentJson, {
      shouldDirty: true,
      shouldValidate: false,
    });

    setValue("document.contentHtml", editor.getHTML(), {
      shouldDirty: true,
      shouldValidate: false,
    });

    setValue("document.usedVariables", extractUsedVariables(contentJson), {
      shouldDirty: true,
      shouldValidate: false,
    });
  }, [editor, setValue]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(syncToForm, SYNC_DEBOUNCE_MS);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [editor, syncToForm]);

  return { editor, syncToForm };
};
