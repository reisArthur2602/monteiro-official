import { NextResponse } from "next/server";

import { downloadFromFtp } from "@/lib/ftp";
import { getSession } from "@/utils/auth";

import { clientIdSchema } from "../../../schemas/client-id-schema";
import { getClientDocumentFile } from "../../queries/get-client-document-file";
import { documentIdSchema } from "../../schemas/document-id-schema";

/** Leitura via FTP; precisa do runtime Node. */
export const runtime = "nodejs";

type DownloadRouteContext = {
  params: Promise<{ client_id: string; document_id: string }>;
};

/**
 * Faz o streaming do arquivo a partir do FTP. As credenciais e o caminho
 * remoto nunca chegam ao navegador: o cliente só conhece a rota da
 * aplicação, e cada download revalida a sessão.
 */
export const GET = async (
  _request: Request,
  { params }: DownloadRouteContext,
) => {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Sessão expirada" },
        { status: 401 },
      );
    }

    const { client_id: rawClientId, document_id: rawDocumentId } = await params;

    const parsedClientId = clientIdSchema.safeParse(rawClientId);
    const parsedDocumentId = documentIdSchema.safeParse(rawDocumentId);

    if (!parsedClientId.success || !parsedDocumentId.success) {
      return NextResponse.json(
        { ok: false, message: "Documento não encontrado" },
        { status: 404 },
      );
    }

    const document = await getClientDocumentFile(
      parsedClientId.data,
      parsedDocumentId.data,
    );

    // Mesma resposta para "não existe" e "não é deste cliente": a rota não
    // confirma a existência de um documento que o usuário não pode ver.
    if (!document) {
      return NextResponse.json(
        { ok: false, message: "Documento não encontrado" },
        { status: 404 },
      );
    }

    const body = await downloadFromFtp(document.storageKey);

    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Length": String(body.byteLength),
        // `attachment` impede que o navegador renderize o arquivo no
        // próprio domínio da aplicação.
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
          document.originalName,
        )}`,
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[downloadClientDocument]", error);

    return NextResponse.json(
      { ok: false, message: "Não foi possível baixar o documento" },
      { status: 500 },
    );
  }
};
