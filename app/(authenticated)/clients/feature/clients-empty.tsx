import { Users } from "lucide-react";
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

import {
  buildClientUpsertHref,
  CLIENTS_PATH,
} from "../utils/build-clients-href";

type ClientsEmptyProps = {
  hasFilters: boolean;
};

export const ClientsEmpty = ({ hasFilters }: ClientsEmptyProps) => (
  <Empty className="rounded-xl border bg-card">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Users />
      </EmptyMedia>

      <EmptyTitle>
        {hasFilters ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
      </EmptyTitle>

      <EmptyDescription>
        {hasFilters
          ? "Revise a busca ou limpe os filtros para consultar toda a carteira."
          : "Cadastre o primeiro cliente para começar a montar a carteira do escritório."}
      </EmptyDescription>
    </EmptyHeader>

    <EmptyContent>
      {hasFilters ? (
        <Button asChild variant="outline">
          <Link href={CLIENTS_PATH}>Limpar filtros</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href={buildClientUpsertHref()}>Cadastrar cliente</Link>
        </Button>
      )}
    </EmptyContent>
  </Empty>
);
