import { UserSearch } from "lucide-react";
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

import { buildUsersHref } from "../utils/build-users-href";

type UsersEmptyProps = {
  hasFilters: boolean;
};

export const UsersEmpty = ({ hasFilters }: UsersEmptyProps) => (
  <Empty className="rounded-xl border bg-card">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <UserSearch />
      </EmptyMedia>

      <EmptyTitle>
        {hasFilters ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
      </EmptyTitle>

      <EmptyDescription>
        {hasFilters
          ? "Revise a busca ou altere os filtros."
          : "Convide o primeiro usuário para começar."}
      </EmptyDescription>
    </EmptyHeader>

    {hasFilters ? (
      <EmptyContent>
        <Button asChild variant="outline">
          <Link href={buildUsersHref({})}>Limpar filtros</Link>
        </Button>
      </EmptyContent>
    ) : null}
  </Empty>
);
