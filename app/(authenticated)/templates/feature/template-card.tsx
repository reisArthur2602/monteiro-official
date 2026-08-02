import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { TemplateListItem } from "../queries/list-templates";
import { formatRelativeDate } from "../utils/format-relative-date";
import {
  templateCategoryLabels,
  templateStatusBadgeClasses,
  templateStatusLabels,
} from "../utils/template-labels";

type TemplateMetaProps = {
  label: string;
  value: string;
};

const TemplateMeta = ({ label, value }: TemplateMetaProps) => (
  <div className="grid min-w-0 gap-0.5">
    <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
      {label}
    </span>

    <span className="truncate font-mono text-xs font-medium">{value}</span>
  </div>
);

type TemplateCardProps = {
  template: TemplateListItem;
};

export const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-ring/60 focus-within:border-ring/60">
      <div className="relative grid min-h-44 place-items-center border-b bg-muted">
        <Badge
          variant="outline"
          className={cn(
            "absolute top-3 right-3 z-10",
            templateStatusBadgeClasses[template.status],
          )}
        >
          {templateStatusLabels[template.status]}
        </Badge>

        {/* Representação abstrata da folha do documento. */}
        <div
          aria-hidden="true"
          className="relative aspect-210/297 w-22 border bg-white p-2.5 shadow-lg"
        >
          <span className="block h-1 w-5/6 rounded-full bg-neutral-300" />
          <span className="mt-1.5 block h-1 w-2/3 rounded-full bg-neutral-300" />
          <span className="mt-1.5 block h-1 w-4/5 rounded-full bg-neutral-300" />
          <span className="mt-1.5 block h-1 w-3/4 rounded-full bg-neutral-300" />
          <span className="mt-1.5 block h-1 w-2/3 rounded-full bg-neutral-300" />
          <span className="absolute right-3 bottom-4 left-3 border-t border-neutral-300" />
          <span className="absolute right-2.5 bottom-2 size-4 rounded-full border border-destructive/50" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid gap-1.5">
          <h2 className="font-heading text-lg leading-snug font-semibold tracking-tight">
            <Link
              href={`/templates/upsert?templateId=${template.id}`}
              className="outline-none after:absolute after:inset-0 hover:text-primary"
            >
              {template.name}
            </Link>
          </h2>

          <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {template.description ?? "Sem descrição cadastrada."}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <TemplateMeta
            label="Categoria"
            value={templateCategoryLabels[template.category]}
          />

          <TemplateMeta label="Área" value={template.legalArea ?? "—"} />
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t bg-muted px-5 py-3 text-xs text-muted-foreground">
        <span>Atualizado {formatRelativeDate(template.updatedAt)}</span>

        <span className="font-mono font-medium">
          {template.currentVersion > 0
            ? `v${template.currentVersion}`
            : "sem versão"}
        </span>
      </footer>
    </article>
  );
};
