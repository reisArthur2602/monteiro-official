import { SquarePen } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { formatUpdatedAt } from "../../../utils/format-updated-at";
import { buildIntakeDetailHref } from "../../intakes/utils/build-intakes-href";
import { formatDate } from "../../utils/format-date";
import type { ClientCaseListItem } from "../queries/list-client-cases";
import { buildCaseEditHref } from "../utils/build-cases-href";
import {
  processClientRoleLabels,
  processStatusBadgeClasses,
  processStatusLabels,
  processTypeLabels,
} from "../utils/case-labels";
import { CasePagePreview } from "./case-page-preview";

type CaseCardProps = {
  clientId: string;
  item: ClientCaseListItem;
  /** Alterna a leve rotação do mockup de página, como no protótipo. */
  index: number;
};

const UNTITLED_INTAKE = "Ficha sem assunto";

export const CaseCard = ({ clientId, item, index }: CaseCardProps) => {
  const typeLabel = processTypeLabels[item.type];
  const forum = item.courtUnit ?? item.court;

  return (
    <article className="grid min-h-127.5 grid-rows-[176px_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border bg-card shadow-xs transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm">
      <div
        className="relative overflow-hidden border-b bg-muted p-4.5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 12%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 26%)",
        }}
      >
        <Badge
          variant="outline"
          className={cn(
            "absolute top-3 right-3 z-10 gap-1.5 font-bold",
            processStatusBadgeClasses[item.status],
          )}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {processStatusLabels[item.status]}
        </Badge>

        <CasePagePreview
          heading={`${typeLabel} · ${item.legalArea}`}
          internalCode={item.internalCode}
          rotateAlternate={index % 2 === 1}
        />
      </div>

      <div className="grid content-start gap-2.5 p-4">
        <span className="font-mono text-[9px] font-semibold tracking-wider text-primary uppercase">
          {typeLabel} · {item.legalArea}
        </span>

        <h3 className="line-clamp-2 font-heading text-xl leading-tight font-semibold tracking-tight">
          {item.title}
        </h3>

        <p className="truncate font-mono text-[8.5px] text-muted-foreground">
          {item.number ?? "Sem número — aguardando distribuição"}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-muted-foreground">
          {forum ? <span className="basis-full truncate">{forum}</span> : null}

          <span>{processClientRoleLabels[item.clientRole]}</span>
          <span>{item.responsible.name}</span>
        </div>

        {/*
          A ficha é a origem obrigatória do processo — e a única rota de
          detalhe que já existe, por isso é o link do card.
        */}
        <Link
          href={buildIntakeDetailHref(clientId, item.attendanceForm.id)}
          className="grid gap-0.5 rounded-lg border bg-muted p-2.5 outline-none transition-colors hover:border-primary/30 focus-visible:border-primary"
        >
          <span className="font-mono text-[7px] tracking-wider text-muted-foreground uppercase">
            Ficha de origem
          </span>

          <span className="truncate text-[9px] font-semibold">
            {item.attendanceForm.subject ?? UNTITLED_INTAKE}
          </span>

          <span className="text-[8px] text-muted-foreground">
            Atendimento de {formatDate(item.attendanceForm.attendanceAt)}
          </span>
        </Link>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[8px] text-muted-foreground">
          <span>
            <strong className="font-mono text-foreground">
              {item.movementsCount}
            </strong>{" "}
            movimentos
          </span>

          <span>
            <strong className="font-mono text-foreground">
              {item.documentsCount}
            </strong>{" "}
            documentos
          </span>

          <span>
            <strong className="font-mono text-foreground">
              {item.deadlinesCount}
            </strong>{" "}
            prazos
          </span>
        </div>

        <div className="grid gap-0.5 border-l-2 border-primary/65 pl-2.5">
          <span className="font-mono text-[7px] tracking-wider text-muted-foreground uppercase">
            Próximo marco
          </span>

          <strong className="truncate text-[9px]">
            {item.nextDeadline?.title ?? "Sem prazo aberto"}
          </strong>

          <small className="text-[8px] text-muted-foreground">
            {item.nextDeadline
              ? formatDate(item.nextDeadline.dueAt)
              : "Monitoramento"}
          </small>
        </div>
      </div>

      <footer className="flex min-h-13 items-center justify-between gap-3 border-t px-3.5 pr-1.5 text-[9px] text-muted-foreground">
        <span className="truncate">
          Movimentado {formatUpdatedAt(item.updatedAt)}
        </span>

        <Button
          asChild
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Link
            href={buildCaseEditHref(clientId, item.id)}
            aria-label={`Editar ${item.title}`}
          >
            <SquarePen aria-hidden="true" />
          </Link>
        </Button>
      </footer>
    </article>
  );
};
