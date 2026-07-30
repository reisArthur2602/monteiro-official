import { mergeAttributes, Node } from "@tiptap/core";

import type { TemplateVariableSource } from "../types/template-types";

export type TemplateVariableAttributes = {
  key: string;
  label: string;
  source: TemplateVariableSource;
};

const VARIABLE_SOURCES: TemplateVariableSource[] = [
  "CLIENT",
  "CASE",
  "OFFICE",
  "DOCUMENT",
];

const parseSource = (value: unknown): TemplateVariableSource =>
  VARIABLE_SOURCES.includes(value as TemplateVariableSource)
    ? (value as TemplateVariableSource)
    : "DOCUMENT";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    templateVariable: {
      insertTemplateVariable: (
        attributes: TemplateVariableAttributes,
      ) => ReturnType;
    };
  }
}

/**
 * Variável jurídica como node atômico inline.
 *
 * `atom` impede edição parcial: o usuário seleciona e remove o token
 * inteiro, nunca metade de `{{cliente.nome}}`. A serialização usa apenas
 * atributos `data-*`, que é exatamente o conjunto aceito pela sanitização
 * do documento.
 */
export const TemplateVariable = Node.create({
  name: "templateVariable",

  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      key: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-template-variable") ?? "",
        renderHTML: (attributes) => ({
          "data-template-variable": attributes.key as string,
        }),
      },
      label: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-variable-label") ?? "",
        renderHTML: (attributes) => ({
          "data-variable-label": attributes.label as string,
        }),
      },
      source: {
        default: "DOCUMENT",
        parseHTML: (element) =>
          parseSource(element.getAttribute("data-variable-source")),
        renderHTML: (attributes) => ({
          "data-variable-source": attributes.source as string,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-template-variable]" }];
  },

  // Sem `class`: o estilo vem do próprio `data-template-variable`, para o
  // documento não carregar nenhuma classe arbitrária.
  renderHTML({ HTMLAttributes, node }) {
    return ["span", mergeAttributes(HTMLAttributes), `{{${node.attrs.key}}}`];
  },

  renderText({ node }) {
    return `{{${node.attrs.key}}}`;
  },

  addCommands() {
    return {
      insertTemplateVariable:
        (attributes) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    };
  },
});
