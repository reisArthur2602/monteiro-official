const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

type BuildClientTemplateEmailHtmlInput = {
  message: string;
  documentHtml: string;
};

/**
 * Corpo HTML do e-mail: a mensagem digitada por quem envia, seguida do
 * documento já resolvido. Estilo inline e simplificado de propósito —
 * clientes de e-mail não aplicam `legal-document.css`, então isto não
 * tenta reproduzir a folha A4, só manter o texto legível.
 */
export const buildClientTemplateEmailHtml = ({
  message,
  documentHtml,
}: BuildClientTemplateEmailHtmlInput): string => `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#17201d;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d7ddd9;border-radius:12px;padding:28px;">
      <p style="margin:0 0 20px;white-space:pre-wrap;font-size:14px;line-height:1.6;">${escapeHtml(message)}</p>

      <hr style="margin:0 0 20px;border:none;border-top:1px solid #d7ddd9;" />

      <div style="font-family:Georgia,'Source Serif 4',serif;font-size:13px;line-height:1.6;color:#17201d;">
        ${documentHtml}
      </div>
    </div>
  </body>
</html>`;
