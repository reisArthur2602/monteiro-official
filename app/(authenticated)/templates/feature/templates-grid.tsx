import { FileText } from "lucide-react";
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

import type { TemplateListItem } from "../queries/list-templates";
import { TEMPLATES_PATH } from "../utils/build-templates-href";
import { TemplateCard } from "./template-card";

type TemplatesGridProps = {
  templates: TemplateListItem[];
  hasFilters: boolean;
};

export const TemplatesGrid = ({
  templates,
  hasFilters,
}: TemplatesGridProps) => {
  if (templates.length === 0) {
    return (
      <Empty className="rounded-xl border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>

          <EmptyTitle>
            {hasFilters
              ? "Nenhum template encontrado"
              : "Nenhum template cadastrado"}
          </EmptyTitle>

          <EmptyDescription>
            {hasFilters
              ? "Revise a busca ou limpe os filtros para consultar toda a biblioteca."
              : "Crie o primeiro modelo para padronizar os documentos do escritório."}
          </EmptyDescription>
        </EmptyHeader>

        {hasFilters ? (
          <EmptyContent>
            <Button asChild variant="outline">
              <Link href={TEMPLATES_PATH}>Limpar filtros</Link>
            </Button>
          </EmptyContent>
        ) : null}
      </Empty>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
};
