import { TableCell, TableRow } from "@/components/ui/table";

import type { ClientListItem } from "../queries/list-clients";
import { clientTypeLabels } from "../utils/client-labels";
import { formatLocation } from "../utils/format-location";
import { formatPhone } from "../utils/format-phone";
import { formatUpdatedAt } from "../utils/format-updated-at";
import { ClientIdentity } from "./client-identity";
import { ClientStatusBadge } from "./client-status-badge";

type ClientRowProps = {
  client: ClientListItem;
};

export const ClientRow = ({ client }: ClientRowProps) => {
  const location = formatLocation(client.address);

  return (
    <TableRow>
      <TableCell>
        <ClientIdentity
          name={client.name}
          displayName={client.displayName}
          document={client.document}
        />
      </TableCell>

      <TableCell>
        <span className="font-mono text-[10px] text-muted-foreground">
          {clientTypeLabels[client.type]}
        </span>
      </TableCell>

      <TableCell>
        <div className="grid gap-0.5">
          <span className="truncate">{client.email ?? "—"}</span>

          <span className="text-xs text-muted-foreground">
            {client.phone ? formatPhone(client.phone) : "—"}
          </span>
        </div>
      </TableCell>

      <TableCell className="whitespace-nowrap">
        {location ?? <span className="text-muted-foreground">—</span>}
      </TableCell>

      <TableCell>{client.responsible.name}</TableCell>

      <TableCell>
        <ClientStatusBadge status={client.status} />
      </TableCell>

      <TableCell className="whitespace-nowrap text-muted-foreground">
        {formatUpdatedAt(client.updatedAt)}
      </TableCell>
    </TableRow>
  );
};
