import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';

import type { ListCaseMovementsParams } from '../schemas/list-case-movements-params-schema';
import { buildCaseMovementsFilterHref } from '../utils/build-case-movements-href';

type CaseMovementsPaginationProps = {
    clientId: string;
    caseId: string;
    params: ListCaseMovementsParams;
    page: number;
    pageCount: number;
};

export const CaseMovementsPagination = ({
    clientId,
    caseId,
    params,
    page,
    pageCount,
}: CaseMovementsPaginationProps) => {
    const hasPrevious = page > 1;
    const hasNext = page < pageCount;

    return (
        <Pagination className="justify-end border-t px-4 py-3">
            <PaginationContent>
                <PaginationItem>
                    {hasPrevious ? (
                        <Button asChild variant="outline" size="sm">
                            <Link
                                href={buildCaseMovementsFilterHref(clientId, caseId, {
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
                                href={buildCaseMovementsFilterHref(clientId, caseId, {
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
