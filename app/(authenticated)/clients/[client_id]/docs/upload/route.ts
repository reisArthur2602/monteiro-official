import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  assertUploadIsAllowed,
  FtpValidationException,
  removeFromFtp,
  uploadToFtp,
} from "@/lib/ftp";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/utils/auth";

import { clientIdSchema } from "../../schemas/client-id-schema";
import { uploadDocumentSchema } from "../schemas/upload-document-schema";
import { deriveTitleFromFileName } from "../utils/derive-title-from-file-name";
import { parseTagsInput } from "../utils/parse-tags";

/** O upload lê o arquivo inteiro em memória; precisa do runtime Node. */
export const runtime = "nodejs";

const VALIDATION_MESSAGES: Record<string, string> = {
  EXTENSION_NOT_ALLOWED: "Formato de arquivo não permitido",
  MIME_NOT_ALLOWED: "Formato de arquivo não permitido",
  FILE_TOO_LARGE: "O arquivo excede o limite de 25 MB",
  EMPTY_FILE: "O arquivo enviado está vazio",
};

type UploadRouteContext = {
  params: Promise<{ client_id: string }>;
};

export const POST = async (
  request: Request,
  { params }: UploadRouteContext,
) => {
  try {
    // Route Handler valida a sessão por conta própria: o proxy não é
    // considerado camada de proteção.
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Sessão expirada" },
        { status: 401 },
      );
    }

    const { client_id: rawClientId } = await params;
    const parsedId = clientIdSchema.safeParse(rawClientId);

    if (!parsedId.success) {
      return NextResponse.json(
        { ok: false, message: "Cliente inválido" },
        { status: 400 },
      );
    }

    const clientId = parsedId.data;

    const client = await prisma.client.findFirst({
      where: { id: clientId, deletedAt: null },
      select: { id: true },
    });

    if (!client) {
      return NextResponse.json(
        { ok: false, message: "Cliente não encontrado ou acesso negado" },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Selecione um arquivo para enviar" },
        { status: 400 },
      );
    }

    const rawTags = formData.get("tags");

    const parsedFields = uploadDocumentSchema.safeParse({
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      category: formData.get("category"),
      visibility: formData.get("visibility") || undefined,
      documentDate: formData.get("documentDate") || undefined,
      tags:
        typeof rawTags === "string" && rawTags.length > 0
          ? parseTagsInput(rawTags)
          : [],
    });

    if (!parsedFields.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Revise os campos informados",
          errors: parsedFields.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    // Tipo, extensão e tamanho são conferidos no servidor — o `accept` do
    // input é só conveniência de interface.
    const extension = assertUploadIsAllowed({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const body = Buffer.from(await file.arrayBuffer());

    const storageKey = await uploadToFtp({
      clientId,
      extension,
      body,
    });

    try {
      await prisma.clientDocument.create({
        data: {
          clientId,
          title: parsedFields.data.title || deriveTitleFromFileName(file.name),
          description: parsedFields.data.description ?? null,
          category: parsedFields.data.category,
          visibility: parsedFields.data.visibility,
          tags: parsedFields.data.tags,
          documentDate: parsedFields.data.documentDate
            ? new Date(`${parsedFields.data.documentDate}T00:00:00Z`)
            : null,
          storageKey,
          originalName: file.name.slice(0, 255),
          mimeType: file.type,
          sizeBytes: BigInt(file.size),
          uploadedById: user.id,
          updatedById: user.id,
        },
        select: { id: true },
      });
    } catch (error) {
      // O arquivo já subiu, mas o registro falhou. Sem a linha no banco o
      // arquivo é inalcançável, então ele é removido para não virar lixo
      // órfão no FTP.
      await removeFromFtp(storageKey).catch(() => undefined);

      throw error;
    }

    revalidatePath(`/clients/${clientId}/docs`);
    revalidatePath(`/clients/${clientId}`);

    return NextResponse.json({
      ok: true,
      message: "Documento enviado com sucesso",
    });
  } catch (error) {
    if (error instanceof FtpValidationException) {
      return NextResponse.json(
        {
          ok: false,
          message:
            VALIDATION_MESSAGES[error.code] ?? "Arquivo inválido",
        },
        { status: 422 },
      );
    }

    console.error("[uploadClientDocument]", error);

    return NextResponse.json(
      { ok: false, message: "Não foi possível enviar o documento" },
      { status: 500 },
    );
  }
};
