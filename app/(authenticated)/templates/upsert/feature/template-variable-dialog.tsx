"use client";

import type { Editor } from "@tiptap/core";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  templateVariableGroups,
  templateVariables,
} from "../data/template-variables";

type TemplateVariableDialogProps = {
  editor: Editor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInserted: () => void;
};

export const TemplateVariableDialog = ({
  editor,
  open,
  onOpenChange,
  onInserted,
}: TemplateVariableDialogProps) => {
  const insert = (key: string) => {
    const variable = templateVariables.find((item) => item.key === key);

    if (!editor || !variable) {
      return;
    }

    // `focus()` sem argumento restaura a seleção que existia antes de o
    // diálogo abrir, então a variável entra exatamente onde o cursor
    // estava — e o foco volta para o editor ao fechar.
    editor
      .chain()
      .focus()
      .insertTemplateVariable({
        key: variable.key,
        label: variable.label,
        source: variable.source,
      })
      .run();

    onOpenChange(false);
    onInserted();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Inserir variável"
      description="Busque uma variável jurídica para inserir no documento"
    >
      {/*
        Nesta versão do shadcn, CommandDialog não envolve os filhos em
        <Command> — só monta Dialog > DialogContent. CommandInput e
        CommandList dependem do contexto do cmdk fornecido por <Command>,
        então ele precisa ser adicionado aqui.
      */}
      <Command>
        <CommandInput placeholder="Buscar variável…" />

        <CommandList>
          <CommandEmpty>Nenhuma variável encontrada.</CommandEmpty>

          {templateVariableGroups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {templateVariables
                .filter((variable) => variable.group === group)
                .map((variable) => (
                  <CommandItem
                    key={variable.key}
                    value={`${variable.label} ${variable.key} ${variable.group}`}
                    onSelect={() => insert(variable.key)}
                  >
                    <span className="flex-1">{variable.label}</span>

                    <code className="font-mono text-[10px] text-muted-foreground">
                      {variable.key}
                    </code>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};
