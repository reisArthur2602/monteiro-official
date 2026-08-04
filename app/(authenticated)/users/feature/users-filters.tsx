"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { UserRole } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  type ListUsersParams,
  UserListStatus,
} from "../schemas/list-users-params-schema";
import {
  buildUsersHref,
  hasActiveUsersFilters,
} from "../utils/build-users-href";
import { userListStatusLabels, userRoleLabels } from "../utils/user-labels";

const ALL_OPTION = "all";
const SEARCH_DEBOUNCE_MS = 400;

type UsersFiltersProps = {
  params: ListUsersParams;
};

export const UsersFilters = ({ params }: UsersFiltersProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(params.search ?? "");

  const currentSearch = params.search ?? "";

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const value = search.trim();

    if (value === currentSearch) {
      return;
    }

    const timeout = setTimeout(() => {
      startTransition(() => {
        router.replace(
          buildUsersHref({ ...params, search: value || undefined }),
          { scroll: false },
        );
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [search, currentSearch, params, router]);

  const applyFilter = (patch: Partial<ListUsersParams>) => {
    startTransition(() => {
      router.replace(
        buildUsersHref({
          ...params,
          search: search.trim() || undefined,
          ...patch,
        }),
        { scroll: false },
      );
    });
  };

  const clearFilters = () => {
    setSearch("");

    startTransition(() => {
      router.replace(buildUsersHref({}), { scroll: false });
    });
  };

  return (
    <div className="grid gap-3 rounded-xl border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]">
      <Field>
        <FieldLabel htmlFor="user-search" className="sr-only">
          Buscar por nome ou e-mail
        </FieldLabel>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="user-search"
            type="search"
            className="pl-9"
            placeholder="Buscar por nome ou e-mail"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="user-role" className="sr-only">
          Filtrar por função
        </FieldLabel>

        <Select
          value={params.role ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              role: value === ALL_OPTION ? undefined : (value as UserRole),
            })
          }
        >
          <SelectTrigger id="user-role" className="w-full">
            <SelectValue placeholder="Todas as funções" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todas as funções</SelectItem>

            {Object.values(UserRole).map((role) => (
              <SelectItem key={role} value={role}>
                {userRoleLabels[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="user-status" className="sr-only">
          Filtrar por status
        </FieldLabel>

        <Select
          value={params.status ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              status:
                value === ALL_OPTION ? undefined : (value as UserListStatus),
            })
          }
        >
          <SelectTrigger id="user-status" className="w-full">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todos os status</SelectItem>

            {Object.values(UserListStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {userListStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {hasActiveUsersFilters(params) ? (
        <Button type="button" variant="ghost" onClick={clearFilters}>
          <X aria-hidden="true" />
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
};
