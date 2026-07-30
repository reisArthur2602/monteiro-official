type DocumentContentProps = {
  /**
   * HTML derivado do JSON do editor.
   *
   * Nunca receba aqui HTML enviado pelo navegador. O caminho confiável é
   * sempre `contentJson` -> validação pelo schema do ProseMirror ->
   * `generateHTML`, feito no servidor. Nós e atributos fora do schema são
   * rejeitados nessa conversão, que é a fronteira de sanitização do
   * documento.
   */
  html: string;
};

export const DocumentContent = ({ html }: DocumentContentProps) => (
  <div
    className="legal-document__content"
    // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML derivado do schema do editor, gerado no servidor a partir do JSON.
    dangerouslySetInnerHTML={{ __html: html }}
  />
);
