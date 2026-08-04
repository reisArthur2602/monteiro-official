const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

type BuildDocumentEmailHtmlInput = {
  message: string;
  documentTitle: string;
  documentHtml: string;
};

/**
 * Corpo HTML de um e-mail que embute um documento (template preenchido,
 * ficha de atendimento, etc.) dentro de uma moldura visualmente distinta da
 * mensagem pessoal — sem isso, o documento (tipografia simples, sem cor) se
 * confunde com a própria mensagem e passa a impressão de não ter sido
 * enviado.
 *
 * Estilo inline de propósito: clientes de e-mail não aplicam
 * `legal-document.css`, então isto não tenta reproduzir a folha A4, só
 * deixar claro que o documento está aqui, embutido — não é um anexo
 * separado. Compartilhado entre todo formato de documento que possa ser
 * enviado por e-mail, para a moldura ser sempre a mesma.
 */
export const buildDocumentEmailHtml = ({
  message,
  documentTitle,
  documentHtml,
}: BuildDocumentEmailHtmlInput): string => `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#17201d;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d7ddd9;border-radius:12px;padding:28px;">
      <p style="margin:0 0 24px;white-space:pre-wrap;font-size:14px;line-height:1.6;">${escapeHtml(message)}</p>

      <div style="border:1px solid #d7ddd9;border-radius:10px;overflow:hidden;">
        <div style="background:#f6f8fb;padding:10px 16px;border-bottom:1px solid #d7ddd9;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#5d6878;">
          Documento: ${escapeHtml(documentTitle)}
        </div>

        <div style="padding:20px 22px;font-family:Georgia,'Source Serif 4',serif;font-size:13px;line-height:1.6;color:#17201d;">
          ${documentHtml}
        </div>
      </div>
    </div>
  </body>
</html>`;
