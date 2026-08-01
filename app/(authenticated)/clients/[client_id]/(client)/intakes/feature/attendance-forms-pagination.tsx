import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import type { ListAttendanceFormsParams } from "../schemas/list-attendance-forms-params-schema";
import { buildIntakesHref } from "../utils/build-intakes-href";

type AttendanceFormsPaginationProps = {
  clientId: string;
  params: ListAttendanceFormsParams;
  page: number;
  pageCount: number;
  total: number;
  from: number;
  to: number;
};

export const AttendanceFormsPagination = ({
  clientId,
  params,
  page,
  pageCount,
  total,
  from,
  to,
}: AttendanceFormsPaginationProps) => {
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  return (
    <Pagination className="flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Exibindo {from}–{to} de {total} {total === 1 ? "ficha" : "fichas"}
      </p>

      <PaginationContent>
        <PaginationItem>
          {hasPrevious ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={buildIntakesHref(clientId, { ...params, page: page - 1 })}
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
                href={buildIntakesHref(clientId, { ...params, page: page + 1 })}
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
