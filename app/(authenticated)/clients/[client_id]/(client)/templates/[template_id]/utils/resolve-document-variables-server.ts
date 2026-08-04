const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Casa exatamente a marcação que `TemplateVariable` (nó atômico do editor)
 * sempre gera: `<span data-template-variable="chave" ...>{{chave}}</span>`,
 * sem nenhum elemento aninhado — é o que garante que o `[^<]*` entre as tags
 * nunca engula conteúdo de verdade do documento.
 */
const VARIABLE_SPAN_PATTERN =
  /<span\b[^>]*\bdata-template-variable="([^"]*)"[^>]*>[^<]*<\/span>/g;

/**
 * Mesmo comportamento de `resolveDocumentVariables` (troca o token pelo
 * valor, ou mantém `{{chave}}` quando não há valor), mas sem `DOMParser` —
 * que só existe no navegador. Usado onde a resolução precisa acontecer no
 * servidor, como no corpo de um e-mail: nunca confie no HTML já resolvido
 * que o navegador enviaria, resolva de novo a partir do `contentHtml`
 * publicado, a fonte de verdade.
 */
export const resolveDocumentVariablesServer = (
  html: string,
  values: Record<string, string>,
): string =>
  html.replace(VARIABLE_SPAN_PATTERN, (_match, key: string) =>
    escapeHtml(values[key] ?? `{{${key}}}`),
  );
