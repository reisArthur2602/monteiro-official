import {
    Download,
    FileArchive,
    FileSpreadsheet,
    FileText,
    FileType,
    Image as ImageIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { formatUpdatedAt } from '../../../../../../utils/format-updated-at';
import { buildDocumentDownloadHref } from '../../../../../(client)/docs/utils/build-docs-href';
import {
    clientDocumentVisibilityBadgeClasses,
    clientDocumentVisibilityLabels,
} from '../../../../../(client)/docs/utils/document-labels';
import {
    formatFileExtension,
    formatFileSize,
} from '../../../../../(client)/docs/utils/format-file-size';
import type { CaseDocumentListItem } from '../queries/list-case-documents';
import { processDocumentRoleLabels } from '../utils/case-document-labels';
import {
    type DocumentFormat,
    documentFormatLabels,
    documentFormatToneClasses,
    resolveDocumentFormat,
} from '../utils/document-format';
import { CaseDocumentUnlinkDialog } from './case-document-unlink-dialog';

const FORMAT_ICONS: Record<DocumentFormat, ComponentType<{ className?: string }>> = {
    PDF: FileText,
    TEXTO: FileType,
    PLANILHA: FileSpreadsheet,
    IMAGEM: ImageIcon,
    OUTRO: FileArchive,
};

/** Colunas compartilhadas com o cabeçalho da tabela, para manter o alinhamento. */
export const CASE_DOCS_ROW_GRID =
    'grid grid-cols-[minmax(16rem,1fr)_9rem_6rem_8rem_5.5rem] items-center gap-3';

type CaseDocumentRowProps = {
    clientId: string;
    caseId: string;
    item: CaseDocumentListItem;
};

export const CaseDocumentRow = ({ clientId, caseId, item }: CaseDocumentRowProps) => {
    const format = resolveDocumentFormat(item.mimeType);
    const Icon = FORMAT_ICONS[format];

    return (
        <article
            className={cn(
                CASE_DOCS_ROW_GRID,
                'min-h-18 border-b px-4 py-2.5 transition-colors last:border-b-0 hover:bg-muted/60'
            )}
        >
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5">
                <span
                    className={cn(
                        'grid h-11.5 w-10 place-items-center content-center gap-0.5 rounded-lg border',
                        documentFormatToneClasses[format]
                    )}
                >
                    <Icon className="size-4.5" />
                    <small className="font-mono text-[6px] font-bold">
                        {formatFileExtension(item.originalName)}
                    </small>
                </span>

                <div className="min-w-0">
                    <strong className="block truncate text-xs">{item.title}</strong>

                    <small className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                        {processDocumentRoleLabels[item.role]} · {item.originalName}
                    </small>
                </div>
            </div>

            <div className="grid justify-items-start gap-1">
                <span className="text-[10px] text-muted-foreground">
                    {documentFormatLabels[format]}
                </span>

                <Badge
                    variant="outline"
                    className={cn(
                        'font-bold',
                        clientDocumentVisibilityBadgeClasses[item.visibility]
                    )}
                >
                    {clientDocumentVisibilityLabels[item.visibility]}
                </Badge>
            </div>

            <span className="font-mono text-[10px] text-muted-foreground">
                {formatFileSize(item.sizeBytes)}
            </span>

            <span className="text-[10px] text-muted-foreground">
                {formatUpdatedAt(item.updatedAt)}
            </span>

            <div className="flex justify-end">
                {/*
          Link direto para o Route Handler do arquivo do cliente: o documento
          é o mesmo nas duas telas, então não existe rota de download própria
          do processo. O download é uma navegação do navegador, e o arquivo
          nunca passa pelo JavaScript da página.
        */}
                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                >
                    <a
                        href={buildDocumentDownloadHref(clientId, item.documentId)}
                        aria-label={`Baixar ${item.title}`}
                    >
                        <Download aria-hidden="true" />
                    </a>
                </Button>

                <CaseDocumentUnlinkDialog
                    clientId={clientId}
                    caseId={caseId}
                    linkId={item.id}
                    title={item.title}
                />
            </div>
        </article>
    );
};
