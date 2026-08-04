export const buildInvitationEmailHtml = (
  inviterName: string,
  link: string,
) => `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:24px;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#17201d;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #d7ddd9;border-radius:12px;padding:28px;text-align:center;">
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;">
        ${inviterName} convidou você para acessar o sistema da Monteiro Advocacia.
      </p>

      <a href="${link}" style="display:inline-block;padding:12px 22px;border-radius:8px;background:#2f5bff;color:#ffffff;font-weight:600;text-decoration:none;">
        Criar minha conta
      </a>

      <p style="margin:20px 0 0;font-size:11px;color:#656c69;">
        Este link expira em 7 dias.
      </p>
    </div>
  </body>
</html>`;
