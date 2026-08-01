import { ClipboardList } from "lucide-react";
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
  buildIntakesHref,
  buildIntakeUpsertHref,
} from "../utils/build-intakes-href";

type AttendanceFormsEmptyProps = {
  clientId: string;
  hasFilters: boolean;
};

export const AttendanceFormsEmpty = ({
  clientId,
  hasFilters,
}: AttendanceFormsEmptyProps) => (
  <Empty className="rounded-xl border bg-card">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <ClipboardList />
      </EmptyMedia>

      <EmptyTitle>
        {hasFilters ? "Nenhuma ficha encontrada" : "Nenhuma ficha registrada"}
      </EmptyTitle>

      <EmptyDescription>
        {hasFilters
          ? "Revise a busca ou limpe os filtros para ver todas as fichas do cliente."
          : "Registre a primeira ficha de atendimento deste cliente."}
      </EmptyDescription>
    </EmptyHeader>

    <EmptyContent>
      {hasFilters ? (
        <Button asChild variant="outline">
          <Link href={buildIntakesHref(clientId, {})}>Limpar filtros</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href={buildIntakeUpsertHref(clientId)}>Nova ficha</Link>
        </Button>
      )}
    </EmptyContent>
  </Empty>
);
