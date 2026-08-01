import { Download, FileText } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { buildDocumentDownloadHref } from '../../../../(client)/docs/utils/build-docs-href';
import { formatFileExtension, formatFileSize } from '../../../../(client)/docs/utils/format-file-size';
import { formatUpdatedAt } from '../../../../../utils/format-updated-at';
import type { CaseOverview } from '../queries/get-case-overview';

type CaseRecentDocumentsPanelProps = {
    clientId: string;
    documents: CaseOverview['recentDocuments'];
};

export const CaseRecentDocumentsPanel = ({ clientId, documents }: CaseRecentDocumentsPanelProps) => (
    <section className="overflow-hidden rounded-xl border bg-card">
        <header className="flex min-h-14 items-center border-b px-4 py-3">
            <div>
                <h2 className="text-sm font-semibold">Documentos recentes</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Arquivos do repositório do processo.</p>
            </div>
        </header>

        <div className="grid gap-2 p-4">
            {documents.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum documento vinculado.</p>
            ) : (
                documents.map((document) => (
                    <article
                        key={document.id}
                        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border bg-muted p-2.5"
                    >
                        <span className="grid h-10 w-9 place-items-center gap-0.5 rounded-md border border-primary/20 bg-accent text-primary">
                            <FileText className="size-3.5" />
                            <small className="font-mono text-[6px] font-bold">
                                {formatFileExtension(document.originalName)}
                            </small>
                        </span>

                        <div className="min-w-0">
                            <strong className="block truncate text-xs">{document.title}</strong>
                            <small className="mt-0.5 block text-[10px] text-muted-foreground">
                                {formatFileSize(document.sizeBytes)} · {formatUpdatedAt(document.createdAt)}
                            </small>
                        </div>

                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                        >
                            <Link
                                href={buildDocumentDownloadHref(clientId, document.clientDocumentId)}
                                aria-label={`Baixar ${document.title}`}
                            >
                                <Download aria-hidden="true" />
                            </Link>
                        </Button>
                    </article>
                ))
            )}
        </div>
    </section>
);
