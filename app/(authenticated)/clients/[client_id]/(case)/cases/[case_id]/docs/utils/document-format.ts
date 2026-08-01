/**
 * Agrupamento de formatos usado na coluna "Tipo" e no filtro do explorador.
 *
 * Não existe coluna de formato no banco: o grupo é derivado do `mimeType`
 * já gravado no upload, e o filtro vira uma cláusula sobre esse campo.
 */
export const DOCUMENT_FORMATS = ['PDF', 'TEXTO', 'PLANILHA', 'IMAGEM', 'OUTRO'] as const;

export type DocumentFormat = (typeof DOCUMENT_FORMATS)[number];

/** Rótulo do formato de um arquivo específico (coluna "Tipo"). */
export const documentFormatLabels: Record<DocumentFormat, string> = {
    PDF: 'Documento PDF',
    TEXTO: 'Documento de texto',
    PLANILHA: 'Planilha',
    IMAGEM: 'Imagem',
    OUTRO: 'Outro arquivo',
};

/** Rótulo do formato como opção de filtro, no plural. */
export const documentFormatFilterLabels: Record<DocumentFormat, string> = {
    PDF: 'PDF',
    TEXTO: 'Documentos de texto',
    PLANILHA: 'Planilhas',
    IMAGEM: 'Imagens',
    OUTRO: 'Outros formatos',
};

/**
 * Mesma tinta leve usada nos outros selos do projeto, só com tokens já
 * existentes no Design System — nenhuma cor nova é introduzida aqui.
 */
export const documentFormatToneClasses: Record<DocumentFormat, string> = {
    PDF: 'border-primary/20 bg-accent text-primary',
    TEXTO: 'border-chart-3/25 bg-chart-3/12 text-chart-3',
    PLANILHA: 'border-chart-2/25 bg-chart-2/12 text-chart-2',
    IMAGEM: 'border-chart-4/25 bg-chart-4/12 text-chart-4',
    OUTRO: 'border-border bg-muted text-muted-foreground',
};

const MIME_TYPES_BY_FORMAT = {
    PDF: ['application/pdf'],
    TEXTO: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text',
        'application/rtf',
        'text/rtf',
        'text/plain',
    ],
    PLANILHA: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.spreadsheet',
        'text/csv',
    ],
    IMAGEM: ['image/png', 'image/jpeg', 'image/webp', 'image/heic'],
} satisfies Record<Exclude<DocumentFormat, 'OUTRO'>, string[]>;

const KNOWN_MIME_TYPES = Object.values(MIME_TYPES_BY_FORMAT).flat();

export const resolveDocumentFormat = (mimeType: string): DocumentFormat => {
    for (const [format, mimeTypes] of Object.entries(MIME_TYPES_BY_FORMAT)) {
        if (mimeTypes.includes(mimeType)) {
            return format as DocumentFormat;
        }
    }

    return 'OUTRO';
};

/**
 * Cláusula Prisma do filtro. `OUTRO` é o complemento dos grupos conhecidos,
 * então qualquer formato novo aceito no upload aparece nele sem precisar de
 * alteração aqui.
 */
export const buildMimeTypeFilter = (format: DocumentFormat) =>
    format === 'OUTRO' ? { notIn: KNOWN_MIME_TYPES } : { in: MIME_TYPES_BY_FORMAT[format] };
