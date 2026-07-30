import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import type { ListClientsParams } from "../schemas/list-clients-params-schema";
import { buildClientsHref } from "../utils/build-clients-href";

type ClientsPaginationProps = {
  params: ListClientsParams;
  page: number;
  pageCount: number;
  total: number;
  from: number;
  to: number;
};

export const ClientsPagination = ({
  params,
  page,
  pageCount,
  total,
  from,
  to,
}: ClientsPaginationProps) => {
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  return (
    <Pagination className="flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Exibindo {from}–{to} de {total} {total === 1 ? "cliente" : "clientes"}
      </p>

      <PaginationContent>
        <PaginationItem>
          {hasPrevious ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={buildClientsHref({ ...params, page: page - 1 })}
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
                href={buildClientsHref({ ...params, page: page + 1 })}
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
