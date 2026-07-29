import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import type { ListTemplatesParams } from "../schemas/list-templates-params-schema";
import { buildTemplatesHref } from "../utils/build-templates-href";

type TemplatesPaginationProps = {
  params: ListTemplatesParams;
  page: number;
  pageCount: number;
  total: number;
};

export const TemplatesPagination = ({
  params,
  page,
  pageCount,
  total,
}: TemplatesPaginationProps) => {
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  return (
    <Pagination className="flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Página {page} de {pageCount} · {total}{" "}
        {total === 1 ? "template" : "templates"}
      </p>

      <PaginationContent>
        <PaginationItem>
          {hasPrevious ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={buildTemplatesHref({ ...params, page: page - 1 })}
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
          {hasNext ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={buildTemplatesHref({ ...params, page: page + 1 })}
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
