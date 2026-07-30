import type { ClientListItem } from "../queries/list-clients";
import { clientTypeLabels } from "../utils/client-labels";
import { formatLocation } from "../utils/format-location";
import { formatPhone } from "../utils/format-phone";
import { formatUpdatedAt } from "../utils/format-updated-at";
import { ClientIdentity } from "./client-identity";
import { ClientStatusBadge } from "./client-status-badge";

type CardFieldProps = {
  label: string;
  value: string;
};

const CardField = ({ label, value }: CardFieldProps) => (
  <div className="grid min-w-0 gap-0.5">
    <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
      {label}
    </span>

    <span className="truncate text-xs font-semibold">{value}</span>
  </div>
);

type ClientCardProps = {
  client: ClientListItem;
};

/** Apresentação da carteira em telas estreitas, onde a tabela não cabe. */
export const ClientCard = ({ client }: ClientCardProps) => (
  <article className="grid gap-3.5 rounded-xl border bg-card p-4">
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <ClientIdentity
        name={client.name}
        displayName={client.displayName}
        document={client.document}
      />

      <ClientStatusBadge status={client.status} />
    </header>

    <div className="grid grid-cols-2 gap-3">
      <CardField label="Tipo" value={clientTypeLabels[client.type]} />
      <CardField label="Responsável" value={client.responsible.name} />
      <CardField label="E-mail" value={client.email ?? "—"} />
      <CardField
        label="Telefone"
        value={client.phone ? formatPhone(client.phone) : "—"}
      />
      <CardField
        label="Localidade"
        value={formatLocation(client.address) ?? "—"}
      />
    </div>

    <footer className="border-t pt-3 text-xs text-muted-foreground">
      Atualizado {formatUpdatedAt(client.updatedAt)}
    </footer>
  </article>
);
