/**
 * Troca os tokens de variável do documento pelos valores informados.
 *
 * Trabalha sobre o DOM em vez de expressão regular: o token é sempre um
 * elemento com `data-template-variable`, então a substituição é exata e
 * não depende do formato do HTML ao redor.
 *
 * Fora do navegador devolve o HTML intacto — a prévia roda no cliente, e
 * a futura geração de PDF pelo Chromium também terá DOM disponível.
 */
export const resolveDocumentVariables = (
  html: string,
  values: Record<string, string>,
) => {
  if (typeof DOMParser === "undefined") {
    return html;
  }

  const parsed = new DOMParser().parseFromString(
    `<body>${html}</body>`,
    "text/html",
  );

  for (const node of parsed.querySelectorAll("[data-template-variable]")) {
    const key = node.getAttribute("data-template-variable") ?? "";

    node.replaceWith(parsed.createTextNode(values[key] ?? `{{${key}}}`));
  }

  return parsed.body.innerHTML;
};
