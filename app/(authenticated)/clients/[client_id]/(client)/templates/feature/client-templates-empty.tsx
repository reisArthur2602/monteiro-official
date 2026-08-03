import { NotebookTabs } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { buildClientTemplatesFilterHref } from "../utils/build-client-templates-href";

type ClientTemplatesEmptyProps = {
  clientId: string;
  hasFilters: boolean;
};

export const ClientTemplatesEmpty = ({
  clientId,
  hasFilters,
}: ClientTemplatesEmptyProps) => (
  <Empty className="rounded-xl border bg-card">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <NotebookTabs />
      </EmptyMedia>

      <EmptyTitle>
        {hasFilters ? "Nenhum modelo encontrado" : "Nenhum modelo disponível"}
      </EmptyTitle>

      <EmptyDescription>
        {hasFilters
          ? "Revise a busca ou selecione outra categoria."
          : "Ainda não existe um template publicado na biblioteca do escritório."}
      </EmptyDescription>
    </EmptyHeader>

    {hasFilters ? (
      <EmptyContent>
        <Button asChild variant="outline">
          <Link href={buildClientTemplatesFilterHref(clientId, {})}>
            Limpar filtros
          </Link>
        </Button>
      </EmptyContent>
    ) : null}
  </Empty>
);
