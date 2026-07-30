import { ArrowLeft, SquarePen } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/utils/get-initials";

import { ClientStatusBadge } from "../../feature/client-status-badge";
import {
  buildClientUpsertHref,
  CLIENTS_PATH,
} from "../../utils/build-clients-href";
import { clientTypeLabels } from "../../utils/client-labels";
import { formatDocument } from "../../utils/format-document";
import type { ClientContext } from "../queries/get-client-context";
import { formatDate } from "../utils/format-date";

type ClientContextHeaderProps = {
  client: ClientContext;
};

export const ClientContextHeader = ({ client }: ClientContextHeaderProps) => {
  const heading = client.displayName ?? client.name;
  const documentLabel = client.type === "PESSOA_FISICA" ? "CPF" : "CNPJ";

  return (
    <div className="grid gap-3">
      <Link
        href={CLIENTS_PATH}
        className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Clientes
      </Link>

      <section className="grid gap-5 rounded-2xl border bg-card p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <Avatar className="size-16 rounded-2xl">
          <AvatarFallback className="rounded-2xl bg-accent font-heading text-2xl font-semibold text-accent-foreground">
            {getInitials(heading)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ClientStatusBadge status={client.status} />

            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              {clientTypeLabels[client.type]}
            </span>
          </div>

          <h1 className="mt-1 truncate font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {heading}
          </h1>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              {documentLabel} {formatDocument(client.document)}
            </span>

            <span>Responsável: {client.responsible.name}</span>

            <span>Cliente desde {formatDate(client.createdAt)}</span>
          </div>
        </div>

        <Button asChild className="sm:self-center">
          <Link href={buildClientUpsertHref(client.id)}>
            <SquarePen aria-hidden="true" />
            Editar cliente
          </Link>
        </Button>
      </section>
    </div>
  );
};
