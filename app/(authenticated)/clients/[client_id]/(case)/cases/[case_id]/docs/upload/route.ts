import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { ProcessActivityType } from '@/app/generated/prisma/enums';
import { assertUploadIsAllowed, FtpValidationException, removeFromFtp, uploadToFtp } from '@/lib/ftp';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/utils/auth';

import { clientIdSchema } from '../../../../../(client)/schemas/client-id-schema';
import { deriveTitleFromFileName } from '../../../../../(client)/docs/utils/derive-title-from-file-name';
import { caseIdSchema } from '../../schemas/case-id-schema';
import { uploadCaseDocumentSchema } from '../schemas/upload-case-document-schema';
import { clientCategoryByDocumentRole } from '../utils/case-document-labels';

/** O upload lê o arquivo inteiro em memória; precisa do runtime Node. */
export const runtime = 'nodejs';

const VALIDATION_MESSAGES: Record<string, string> = {
    EXTENSION_NOT_ALLOWED: 'Formato de arquivo não permitido',
    MIME_NOT_ALLOWED: 'Formato de arquivo não permitido',
    FILE_TOO_LARGE: 'O arquivo excede o limite de 25 MB',
    EMPTY_FILE: 'O arquivo enviado está vazio',
};

type UploadRouteContext = {
    params: Promise<{ client_id: string; case_id: string }>;
};

/**
 * Envia um arquivo e o vincula ao processo em uma única operação.
 *
 * O arquivo entra no arquivo geral do cliente (`ClientDocument`) e ganha um
 * vínculo com o processo (`ProcessDocument`). Por isso a chave de storage
 * continua sob o cliente: o documento é o mesmo nas duas telas, sem cópia.
 */
export const POST = async (request: Request, { params }: UploadRouteContext) => {
    try {
        // Route Handler valida a sessão por conta própria: o proxy não é
        // considerado camada de proteção.
        const user = await getSession();

        if (!user) {
            return NextResponse.json({ ok: false, message: 'Sessão expirada' }, { status: 401 });
        }

        const { client_id: rawClientId, case_id: rawCaseId } = await params;

        const parsedClientId = clientIdSchema.safeParse(rawClientId);
        const parsedCaseId = caseIdSchema.safeParse(rawCaseId);

        if (!parsedClientId.success || !parsedCaseId.success) {
            return NextResponse.json({ ok: false, message: 'Processo inválido' }, { status: 400 });
        }

        const clientId = parsedClientId.data;
        const caseId = parsedCaseId.data;

        // O cliente da rota entra no `where`: um processo de outro cliente
        // não é encontrado, em vez de revelar que existe.
        const item = await prisma.process.findUnique({
            where: { id: caseId, clientId, deletedAt: null },
            select: { id: true },
        });

        if (!item) {
            return NextResponse.json(
                { ok: false, message: 'Processo não encontrado ou acesso negado' },
                { status: 404 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            return NextResponse.json(
                { ok: false, message: 'Selecione um arquivo para enviar' },
                { status: 400 }
            );
        }

        const parsedFields = uploadCaseDocumentSchema.safeParse({
            title: formData.get('title') || undefined,
            description: formData.get('description') || undefined,
            role: formData.get('role'),
            visibility: formData.get('visibility') || undefined,
            documentDate: formData.get('documentDate') || undefined,
        });

        if (!parsedFields.success) {
            return NextResponse.json(
                {
                    ok: false,
                    message: 'Revise os campos informados',
                    errors: parsedFields.error.flatten().fieldErrors,
                },
                { status: 422 }
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

        const storageKey = await uploadToFtp({ clientId, extension, body });

        const title = parsedFields.data.title || deriveTitleFromFileName(file.name);

        try {
            // Documento e vínculo nascem juntos: um arquivo sem vínculo não
            // apareceria no processo, e um vínculo sem arquivo é inválido.
            await prisma.$transaction(async (tx) => {
                const document = await tx.clientDocument.create({
                    data: {
                        clientId,
                        title,
                        description: parsedFields.data.description ?? null,
                        category: clientCategoryByDocumentRole[parsedFields.data.role],
                        visibility: parsedFields.data.visibility,
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

                await tx.processDocument.create({
                    data: {
                        processId: caseId,
                        clientDocumentId: document.id,
                        role: parsedFields.data.role,
                        addedById: user.id,
                    },
                });

                await tx.processActivity.create({
                    data: {
                        processId: caseId,
                        type: ProcessActivityType.DOCUMENTO_VINCULADO,
                        title: 'Documento vinculado ao processo',
                        description: `${title} foi enviado e passou a constar no repositório do processo.`,
                        actorId: user.id,
                    },
                });
            });
        } catch (error) {
            // O arquivo já subiu, mas o registro falhou. Sem a linha no banco o
            // arquivo é inalcançável, então ele é removido para não virar lixo
            // órfão no FTP.
            await removeFromFtp(storageKey).catch(() => undefined);

            throw error;
        }

        revalidatePath(`/clients/${clientId}/cases/${caseId}/docs`);
        revalidatePath(`/clients/${clientId}/cases/${caseId}`);
        revalidatePath(`/clients/${clientId}/docs`);

        return NextResponse.json({
            ok: true,
            message: 'Documento vinculado ao processo',
        });
    } catch (error) {
        if (error instanceof FtpValidationException) {
            return NextResponse.json(
                {
                    ok: false,
                    message: VALIDATION_MESSAGES[error.code] ?? 'Arquivo inválido',
                },
                { status: 422 }
            );
        }

        console.error('[uploadCaseDocument]', error);

        return NextResponse.json(
            { ok: false, message: 'Não foi possível enviar o documento' },
            { status: 500 }
        );
    }
};
