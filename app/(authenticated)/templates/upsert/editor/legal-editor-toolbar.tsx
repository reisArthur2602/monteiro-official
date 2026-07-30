"use client";

import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  Bold,
  Braces,
  Indent,
  List,
  ListOrdered,
  MoreHorizontal,
  Outdent,
  Redo2,
  RemoveFormatting,
  SeparatorHorizontal,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

type LegalEditorToolbarProps = {
  editor: Editor | null;
  onInsertVariable: () => void;
};

export const LegalEditorToolbar = ({
  editor,
  onInsertVariable,
}: LegalEditorToolbarProps) => {
  // Assina apenas as flags usadas pela toolbar: o componente não
  // re-renderiza a cada tecla, só quando um destes estados muda.
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      if (!instance) {
        return null;
      }

      return {
        canUndo: instance.can().undo(),
        canRedo: instance.can().redo(),
        isBold: instance.isActive("bold"),
        isBulletList: instance.isActive("bulletList"),
        isOrderedList: instance.isActive("orderedList"),
        isAlignLeft: instance.isActive({ textAlign: "left" }),
        isAlignCenter: instance.isActive({ textAlign: "center" }),
        isAlignJustify: instance.isActive({ textAlign: "justify" }),
        canSink: instance.can().sinkListItem("listItem"),
        canLift: instance.can().liftListItem("listItem"),
      };
    },
  });

  if (!editor || !state) {
    return <div className="min-h-12 border-b bg-muted" aria-hidden="true" />;
  }

  const focus = () => editor.chain().focus();

  return (
    <div
      // A toolbar nunca quebra em duas linhas: rola horizontalmente.
      className="flex min-h-12 items-center gap-1 overflow-x-auto border-b bg-muted px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="toolbar"
      aria-label="Ferramentas de edição"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Desfazer"
        disabled={!state.canUndo}
        onClick={() => focus().undo().run()}
      >
        <Undo2 />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Refazer"
        disabled={!state.canRedo}
        onClick={() => focus().redo().run()}
      >
        <Redo2 />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6 shrink-0" />

      <Toggle
        size="sm"
        aria-label="Negrito"
        pressed={state.isBold}
        onPressedChange={() => focus().toggleBold().run()}
      >
        <Bold />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6 shrink-0" />

      <Toggle
        size="sm"
        aria-label="Alinhar à esquerda"
        pressed={state.isAlignLeft}
        onPressedChange={() => focus().setTextAlign("left").run()}
      >
        <AlignLeft />
      </Toggle>

      <Toggle
        size="sm"
        aria-label="Centralizar"
        pressed={state.isAlignCenter}
        onPressedChange={() => focus().setTextAlign("center").run()}
      >
        <AlignCenter />
      </Toggle>

      <Toggle
        size="sm"
        aria-label="Justificar"
        pressed={state.isAlignJustify}
        onPressedChange={() => focus().setTextAlign("justify").run()}
      >
        <AlignJustify />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6 shrink-0" />

      <Toggle
        size="sm"
        aria-label="Lista com marcadores"
        pressed={state.isBulletList}
        onPressedChange={() => focus().toggleBulletList().run()}
      >
        <List />
      </Toggle>

      <Toggle
        size="sm"
        aria-label="Lista numerada"
        pressed={state.isOrderedList}
        onPressedChange={() => focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6 shrink-0" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0"
        onClick={onInsertVariable}
      >
        <Braces />
        Variável
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Mais ações de edição"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={!state.canSink}
            onSelect={() => focus().sinkListItem("listItem").run()}
          >
            <Indent />
            Aumentar recuo
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!state.canLift}
            onSelect={() => focus().liftListItem("listItem").run()}
          >
            <Outdent />
            Diminuir recuo
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => focus().insertPageBreak().run()}>
            <SeparatorHorizontal />
            Inserir quebra de página
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => focus().unsetAllMarks().unsetTextAlign().run()}
          >
            <RemoveFormatting />
            Limpar formatação
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
