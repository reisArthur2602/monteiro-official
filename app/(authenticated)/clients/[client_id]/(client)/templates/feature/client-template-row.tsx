import { FilePlus2 } from "lucide-react";
import Link from "next/link";

import { templateCategoryLabels } from "@/app/(authenticated)/templates/utils/template-labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { ClientContext } from "../../queries/get-client-context";
import type { ClientUsableTemplate } from "../queries/list-client-usable-templates";
import { buildClientTemplatePreviewHref } from "../utils/build-client-templates-href";
import {
  getUnresolvedClientVariables,
  usesCaseVariables,
} from "../utils/resolve-client-template-variables";

type ClientTemplateRowProps = {
  clientId: string;
  client: ClientContext;
  template: ClientUsableTemplate;
};

export const ClientTemplateRow = ({
  clientId,
  client,
  template,
}: ClientTemplateRowProps) => {
  const missing = getUnresolvedClientVariables(template.usedVariables, client);
  const requiresCase = usesCaseVariables(template.usedVariables);

  return (
    <article className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3.5 rounded-xl border bg-card p-3.5 transition-colors hover:border-ring/60 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]">
      <div
        aria-hidden="true"
        className="grid h-21 place-items-center rounded-lg border bg-muted"
      >
        <div className="relative aspect-210/297 w-11 border bg-white p-1.5 shadow-xs">
          <span className="block h-0.5 w-5/6 rounded-full bg-neutral-300" />
          <span className="mt-1 block h-0.5 w-2/3 rounded-full bg-neutral-300" />
          <span className="mt-1 block h-0.5 w-4/5 rounded-full bg-neutral-300" />
          <span className="mt-1 block h-0.5 w-3/4 rounded-full bg-neutral-300" />
        </div>
      </div>

      <div className="grid min-w-0 gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {requiresCase ? (
            <Badge
              variant="outline"
              className="border-border bg-muted text-muted-foreground"
            >
              Requer processo vinculado
            </Badge>
          ) : missing.length > 0 ? (
            <Badge
              variant="outline"
              className="border-chart-3/40 bg-chart-3/12 text-chart-3"
            >
              Revisar {missing.length} {missing.length === 1 ? "dado" : "dados"}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-chart-2/40 bg-chart-2/12 text-chart-2"
            >
              Pronto para gerar
            </Badge>
          )}

          <Badge variant="outline">
            {templateCategoryLabels[template.category]}
          </Badge>
        </div>

        <h3 className="truncate font-heading text-base leading-tight font-semibold">
          {template.name}
        </h3>

        {template.description ? (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {template.description}
          </p>
        ) : null}
      </div>

      <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center">
        <span className="text-[11px] whitespace-nowrap text-muted-foreground">
          {template.legalArea ?? "Área não informada"}
        </span>

        <Button
          asChild
          size="sm"
          variant={requiresCase ? "outline" : "default"}
        >
          <Link href={buildClientTemplatePreviewHref(clientId, template.id)}>
            <FilePlus2 aria-hidden="true" />
            Usar modelo
          </Link>
        </Button>
      </div>
    </article>
  );
};
