import { mergeAttributes, Node } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pageBreak: {
      insertPageBreak: () => ReturnType;
    };
  }
}

/**
 * Quebra de página explícita. Na tela vira uma linha tracejada; na
 * impressão e na futura geração de PDF, `data-page-break` é o gancho para
 * `break-after: page`.
 */
export const PageBreak = Node.create({
  name: "pageBreak",

  group: "block",
  atom: true,
  selectable: true,

  parseHTML() {
    return [{ tag: "div[data-page-break]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-page-break": "true" }),
    ];
  },

  addCommands() {
    return {
      insertPageBreak:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});
