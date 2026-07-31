import { Scale } from "lucide-react";
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

import { buildClientIntakesHref } from "../../../utils/build-clients-href";
import { buildCasesHref } from "../utils/build-cases-href";

type CasesEmptyProps = {
  clientId: string;
  hasFilters: boolean;
};

export const CasesEmpty = ({ clientId, hasFilters }: CasesEmptyProps) => (
  <Empty className="rounded-xl border bg-card">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Scale />
      </EmptyMedia>

      <EmptyTitle>
        {hasFilters
          ? "Nenhum processo encontrado"
          : "Nenhum processo cadastrado"}
      </EmptyTitle>

      <EmptyDescription>
        {hasFilters
          ? "Revise a busca ou limpe os filtros para ver todos os processos do cliente."
          : "Os processos nascem de uma ficha finalizada. Abra as fichas deste cliente para cadastrar o primeiro."}
      </EmptyDescription>
    </EmptyHeader>

    <EmptyContent>
      {hasFilters ? (
        <Button asChild variant="outline">
          <Link href={buildCasesHref(clientId, {})}>Limpar filtros</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href={buildClientIntakesHref(clientId)}>Abrir fichas</Link>
        </Button>
      )}
    </EmptyContent>
  </Empty>
);
