import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import type { ListClientDocumentsParams } from "../schemas/list-client-documents-params-schema";
import { buildDocsHref } from "../utils/build-docs-href";

type DocumentsPaginationProps = {
  clientId: string;
  params: ListClientDocumentsParams;
  page: number;
  pageCount: number;
  total: number;
  from: number;
  to: number;
};

export const DocumentsPagination = ({
  clientId,
  params,
  page,
  pageCount,
  total,
  from,
  to,
}: DocumentsPaginationProps) => {
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  return (
    <Pagination className="flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Exibindo {from}–{to} de {total}{" "}
        {total === 1 ? "documento" : "documentos"}
      </p>

      <PaginationContent>
        <PaginationItem>
          {hasPrevious ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={buildDocsHref(clientId, { ...params, page: page - 1 })}
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
                href={buildDocsHref(clientId, { ...params, page: page + 1 })}
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
