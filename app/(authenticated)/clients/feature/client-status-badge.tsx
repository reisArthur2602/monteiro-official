import type { ClientStatus } from "@/app/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  clientStatusBadgeClasses,
  clientStatusLabels,
} from "../utils/client-labels";

type ClientStatusBadgeProps = {
  status: ClientStatus;
};

export const ClientStatusBadge = ({ status }: ClientStatusBadgeProps) => (
  <Badge variant="outline" className={cn(clientStatusBadgeClasses[status])}>
    {clientStatusLabels[status]}
  </Badge>
);
