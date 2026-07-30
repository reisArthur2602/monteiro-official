import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

import { TemplatesFilters } from "./feature/templates-filters";
import { TemplatesGridSkeleton } from "./feature/templates-grid-skeleton";
import { TemplatesResults } from "./feature/templates-results";
import { TemplatesSummary } from "./feature/templates-summary";
import { listTemplateLegalAreas } from "./queries/list-template-legal-areas";
import { listTemplatesParamsSchema } from "./schemas/list-templates-params-schema";

export const metadata: Metadata = {
  title: "Templates",
};

type TemplatesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const TemplatesPage = async ({ searchParams }: TemplatesPageProps) => {
  const params = listTemplatesParamsSchema.parse(await searchParams);
  const legalAreas = await listTemplateLegalAreas();

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="grid max-w-3xl gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Biblioteca documental
          </span>

          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            Templates
          </h1>

          <p className="text-muted-foreground">
            Gerencie documentos reutilizáveis, variáveis, assinaturas e versões
            publicadas.
          </p>
        </div>

        <Button asChild>
          <Link href="/templates/upsert">
            <Plus aria-hidden="true" />
            Novo template
          </Link>
        </Button>
      </header>

      <TemplatesSummary />

      <section aria-labelledby="templates-heading" className="grid gap-4">
        <h2 id="templates-heading" className="sr-only">
          Listagem de templates
        </h2>

        <TemplatesFilters params={params} legalAreas={legalAreas} />

        <Suspense
          key={JSON.stringify(params)}
          fallback={<TemplatesGridSkeleton />}
        >
          <TemplatesResults params={params} />
        </Suspense>
      </section>
    </div>
  );
};

export default TemplatesPage;
