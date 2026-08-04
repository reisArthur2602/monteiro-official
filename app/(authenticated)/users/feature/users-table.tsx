import { formatUpdatedAt } from "@/app/(authenticated)/clients/utils/format-updated-at";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/utils";

import type { UserListItem } from "../queries/list-users";
import {
  userListStatusBadgeClasses,
  userListStatusLabels,
  userRoleBadgeClasses,
  userRoleLabels,
} from "../utils/user-labels";
import { UserRowActions } from "./user-row-actions";

type UsersTableProps = {
  items: UserListItem[];
};

export const UsersTable = ({ items }: UsersTableProps) => (
  <div className="overflow-hidden rounded-xl border bg-card">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-56">Usuário</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Último acesso</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item) => (
          <TableRow key={`${item.kind}-${item.id}`}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-[10px] font-bold text-primary">
                  {getInitials(item.name)}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{item.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {item.email}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <Badge
                variant="outline"
                className={userRoleBadgeClasses[item.role]}
              >
                {userRoleLabels[item.role]}
              </Badge>
            </TableCell>

            <TableCell>
              <Badge
                variant="outline"
                className={userListStatusBadgeClasses[item.status]}
              >
                {userListStatusLabels[item.status]}
              </Badge>
            </TableCell>

            <TableCell className="text-[11px] text-muted-foreground">
              {item.lastLoginAt ? formatUpdatedAt(item.lastLoginAt) : "—"}
            </TableCell>

            <TableCell className="text-[11px] text-muted-foreground">
              <div>{formatUpdatedAt(item.createdAt)}</div>

              {item.meta ? (
                <div className="text-[10px]">{item.meta}</div>
              ) : null}
            </TableCell>

            <TableCell>
              <UserRowActions item={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
