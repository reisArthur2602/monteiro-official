import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';

import type { ListCaseDocumentsParams } from '../schemas/list-case-documents-params-schema';
import { buildCaseDocsFilterHref } from '../utils/build-case-docs-href';

type CaseDocsPaginationProps = {
    clientId: string;
    caseId: string;
    params: ListCaseDocumentsParams;
    page: number;
    pageCount: number;
    total: number;
    from: number;
    to: number;
};

export const CaseDocsPagination = ({
    clientId,
    caseId,
    params,
    page,
    pageCount,
    total,
    from,
    to,
}: CaseDocsPaginationProps) => {
    const hasPrevious = page > 1;
    const hasNext = page < pageCount;

    return (
        <Pagination className="flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
                Exibindo {from}–{to} de {total} {total === 1 ? 'documento' : 'documentos'}
            </p>

            <PaginationContent>
                <PaginationItem>
                    {hasPrevious ? (
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href={buildCaseDocsFilterHref(clientId, caseId, {
                                    ...params,
                                    page: page - 1,
                                })}
                                scroll={false}
                            >
                                Anterior
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" disabled>
                            Anterior
                        </Button>
                    )}
                </PaginationItem>

                <PaginationItem>
                    <span className="px-2 font-mono text-xs text-muted-foreground">
                        {page} / {pageCount}
                    </span>
                </PaginationItem>

                <PaginationItem>
                    {hasNext ? (
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href={buildCaseDocsFilterHref(clientId, caseId, {
                                    ...params,
                                    page: page + 1,
                                })}
                                scroll={false}
                            >
                                Próxima
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" disabled>
                            Próxima
                        </Button>
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
