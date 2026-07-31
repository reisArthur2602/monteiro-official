import { FolderOpen } from "lucide-react";
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

import { buildDocsHref } from "../utils/build-docs-href";

type DocumentsEmptyProps = {
  clientId: string;
  hasFilters: boolean;
};

export const DocumentsEmpty = ({
  clientId,
  hasFilters,
}: DocumentsEmptyProps) => (
  <Empty className="rounded-xl border bg-card">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FolderOpen />
      </EmptyMedia>

      <EmptyTitle>
        {hasFilters
          ? "Nenhum documento encontrado"
          : "Nenhum documento arquivado"}
      </EmptyTitle>

      <EmptyDescription>
        {hasFilters
          ? "Revise a busca ou limpe os filtros para ver todos os documentos do cliente."
          : "Envie o primeiro documento para o arquivo deste cliente."}
      </EmptyDescription>
    </EmptyHeader>

    {hasFilters ? (
      <EmptyContent>
        <Button asChild variant="outline">
          <Link href={buildDocsHref(clientId, {})}>Limpar filtros</Link>
        </Button>
      </EmptyContent>
    ) : null}
  </Empty>
);
