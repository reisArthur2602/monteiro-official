import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";

import { PageBreak } from "./page-break-extension";
import { TemplateVariable } from "./template-variable-extension";

const ALIGNMENTS = ["left", "center", "justify"] as const;

/**
 * O TextAlign original serializa o alinhamento como `style="text-align: …"`.
 * Estilo inline é justamente o que o documento não pode carregar, então a
 * extensão é reescrita para emitir `data-text-align`, que é o gancho usado
 * pelo CSS do documento na tela, na impressão e no futuro PDF.
 */
const LegalTextAlign = TextAlign.extend({
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              const value =
                element.getAttribute("data-text-align") ||
                element.style.textAlign;

              return ALIGNMENTS.includes(value as (typeof ALIGNMENTS)[number])
                ? value
                : this.options.defaultAlignment;
            },
            renderHTML: (attributes) => {
              if (!attributes.textAlign) {
                return {};
              }

              return { "data-text-align": attributes.textAlign as string };
            },
          },
        },
      },
    ];
  },
});

/**
 * Editor jurídico deliberadamente restrito.
 *
 * Tudo que produz variação tipográfica está desligado: títulos, itálico,
 * sublinhado, riscado, código, citação, link e linha horizontal. Hierarquia
 * é expressa com negrito e alinhamento, então todo o documento sai com o
 * mesmo corpo de texto — o que mantém a prévia, a impressão e o futuro PDF
 * idênticos entre si.
 *
 * Este conjunto de extensões também é o schema usado no servidor para
 * converter JSON em HTML, e por isso funciona como allowlist: nó ou marca
 * fora desta lista faz a conversão falhar.
 */
export const legalEditorExtensions = [
  StarterKit.configure({
    heading: false,
    italic: false,
    strike: false,
    underline: false,
    code: false,
    codeBlock: false,
    blockquote: false,
    horizontalRule: false,
    link: false,
  }),

  LegalTextAlign.configure({
    types: ["paragraph"],
    alignments: [...ALIGNMENTS],
    defaultAlignment: "justify",
  }),

  TemplateVariable,
  PageBreak,
];
