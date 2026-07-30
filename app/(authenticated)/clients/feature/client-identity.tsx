import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";

import { buildClientUpsertHref } from "../utils/build-clients-href";
import { formatDocument } from "../utils/format-document";

type ClientIdentityProps = {
  clientId: string;
  name: string;
  displayName: string | null;
  document: string;
};

/**
 * Identidade do cliente: avatar, nome e documento mascarado.
 * Compartilhado pela linha da tabela e pelo card do mobile.
 *
 * Quando existe nome fantasia (pessoa jurídica) ou nome social (pessoa
 * física), ele vira a linha principal — é assim que a equipe se refere ao
 * cliente. O nome formal continua visível abaixo, porque razão social e
 * nome de registro são o que aparece em contrato e petição.
 */
export const ClientIdentity = ({
  clientId,
  name,
  displayName,
  document,
}: ClientIdentityProps) => (
  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
    <Avatar className="size-9 rounded-lg">
      <AvatarFallback className="rounded-lg bg-accent text-xs font-bold text-accent-foreground">
        {getInitials(displayName ?? name)}
      </AvatarFallback>
    </Avatar>

    <div className="min-w-0">
      <Link
        href={buildClientUpsertHref(clientId)}
        className="block truncate font-semibold outline-none hover:text-primary focus-visible:underline focus-visible:underline-offset-4"
      >
        {displayName ?? name}
      </Link>

      {displayName ? (
        <p className="truncate text-xs text-muted-foreground">{name}</p>
      ) : null}

      <p className="truncate font-mono text-[10px] text-muted-foreground">
        {formatDocument(document)}
      </p>
    </div>
  </div>
);
