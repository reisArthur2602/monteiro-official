import type { Metadata } from "next";

import { InviteUserDialog } from "./feature/invite-user-dialog";
import { UsersEmpty } from "./feature/users-empty";
import { UsersFilters } from "./feature/users-filters";
import { UsersSummary } from "./feature/users-summary";
import { UsersTable } from "./feature/users-table";
import { listUsers } from "./queries/list-users";
import { listUsersParamsSchema } from "./schemas/list-users-params-schema";
import { hasActiveUsersFilters } from "./utils/build-users-href";

export const metadata: Metadata = {
  title: "Usuários",
};

type UsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const params = listUsersParamsSchema.parse(await searchParams);
  const items = await listUsers(params);

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="grid max-w-3xl gap-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Administração do escritório
          </span>

          <h1 className="text-4xl font-semibold tracking-tight">Usuários</h1>

          <p className="text-muted-foreground">
            Gerencie acessos, funções e convites da equipe.
          </p>
        </div>

        <InviteUserDialog />
      </header>

      <UsersSummary />

      <div className="grid gap-4">
        <UsersFilters params={params} />

        {items.length === 0 ? (
          <UsersEmpty hasFilters={hasActiveUsersFilters(params)} />
        ) : (
          <UsersTable items={items} />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
