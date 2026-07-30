import type { TemplateUsedVariable } from "../types/template-types";

/**
 * Nó genérico do documento TipTap. Só o mínimo necessário para percorrer
 * a árvore — o schema completo é responsabilidade das extensões.
 */
type ProseMirrorNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
};

const isNode = (value: unknown): value is ProseMirrorNode =>
  typeof value === "object" && value !== null;

const walk = (
  node: ProseMirrorNode,
  visit: (node: ProseMirrorNode) => void,
): void => {
  visit(node);

  if (!Array.isArray(node.content)) {
    return;
  }

  for (const child of node.content) {
    if (isNode(child)) {
      walk(child, visit);
    }
  }
};

/**
 * Um documento é considerado vazio quando não possui texto visível nem
 * nenhum nó atômico (variável ou quebra de página).
 */
export const isEmptyDocument = (contentJson: unknown): boolean => {
  if (!isNode(contentJson)) {
    return true;
  }

  let hasContent = false;

  walk(contentJson, (node) => {
    if (hasContent) {
      return;
    }

    if (typeof node.text === "string" && node.text.trim().length > 0) {
      hasContent = true;
      return;
    }

    if (node.type === "templateVariable" || node.type === "pageBreak") {
      hasContent = true;
    }
  });

  return !hasContent;
};

/**
 * Deriva as variáveis efetivamente usadas a partir do JSON do editor.
 * A lista nunca é montada manualmente: ela é sempre um reflexo do conteúdo.
 */
export const extractUsedVariables = (
  contentJson: unknown,
): TemplateUsedVariable[] => {
  if (!isNode(contentJson)) {
    return [];
  }

  const found = new Map<string, TemplateUsedVariable>();

  walk(contentJson, (node) => {
    if (node.type !== "templateVariable" || !node.attrs) {
      return;
    }

    const key = node.attrs.key;
    const label = node.attrs.label;
    const source = node.attrs.source;

    if (typeof key !== "string" || found.has(key)) {
      return;
    }

    found.set(key, {
      key,
      label: typeof label === "string" ? label : key,
      source:
        source === "CLIENT" ||
        source === "CASE" ||
        source === "OFFICE" ||
        source === "DOCUMENT"
          ? source
          : "DOCUMENT",
    });
  });

  return [...found.values()];
};
