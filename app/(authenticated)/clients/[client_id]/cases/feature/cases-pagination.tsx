import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import type { ListClientCasesParams } from "../schemas/list-client-cases-params-schema";
import { buildCasesHref } from "../utils/build-cases-href";

type CasesPaginationProps = {
  clientId: string;
  params: ListClientCasesParams;
  page: number;
  pageCount: number;
  total: number;
  from: number;
  to: number;
};

export const CasesPagination = ({
  clientId,
  params,
  page,
  pageCount,
  total,
  from,
  to,
}: CasesPaginationProps) => {
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  return (
    <Pagination className="flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Exibindo {from}–{to} de {total}{" "}
        {total === 1 ? "processo" : "processos"}
      </p>

      <PaginationContent>
        <PaginationItem>
          {hasPrevious ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={buildCasesHref(clientId, { ...params, page: page - 1 })}
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
                href={buildCasesHref(clientId, { ...params, page: page + 1 })}
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
