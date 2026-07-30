"use client";

import type { Editor } from "@tiptap/core";
import { EditorContent } from "@tiptap/react";

import { Skeleton } from "@/components/ui/skeleton";

type LegalRichTextEditorProps = {
  editor: Editor | null;
};

export const LegalRichTextEditor = ({ editor }: LegalRichTextEditorProps) => {
  if (!editor) {
    return (
      <div className="mx-auto w-full max-w-[860px] bg-white p-12 shadow-sm">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="mt-6 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-11/12" />
        <Skeleton className="mt-2 h-4 w-10/12" />
      </div>
    );
  }

  return (
    <EditorContent
      editor={editor}
      className="mx-auto w-full max-w-[860px] min-h-[60vh] border border-neutral-300 bg-white px-[clamp(2rem,7vw,5.25rem)] py-[clamp(2.875rem,6vw,5.125rem)] shadow-sm [&_.ProseMirror]:outline-none"
    />
  );
};
