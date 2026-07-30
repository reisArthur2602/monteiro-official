"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { ClientStatus, ClientType } from "@/app/generated/prisma/enums";
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

import type { ListClientsParams } from "../schemas/list-clients-params-schema";
import {
  buildClientsHref,
  CLIENTS_PATH,
  hasActiveClientFilters,
} from "../utils/build-clients-href";
import { clientStatusLabels, clientTypeLabels } from "../utils/client-labels";

const ALL_OPTION = "all";
const SEARCH_DEBOUNCE_MS = 400;

type ClientsFiltersProps = {
  params: ListClientsParams;
  responsibles: { id: string; name: string }[];
  states: string[];
};

export const ClientsFilters = ({
  params,
  responsibles,
  states,
}: ClientsFiltersProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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
          buildClientsHref({
            ...params,
            search: value || undefined,
            page: 1,
          }),
          { scroll: false },
        );
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [search, currentSearch, params, router]);

  const applyFilter = (patch: Partial<ListClientsParams>) => {
    startTransition(() => {
      router.replace(
        buildClientsHref({
          ...params,
          search: search.trim() || undefined,
          ...patch,
          page: 1,
        }),
        { scroll: false },
      );
    });
  };

  const clearFilters = () => {
    setSearch("");

    startTransition(() => {
      router.replace(CLIENTS_PATH, { scroll: false });
    });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,10rem))_minmax(0,6rem)_auto]">
      <Field>
        <FieldLabel htmlFor="client-search" className="sr-only">
          Buscar cliente
        </FieldLabel>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="client-search"
            type="search"
            className="bg-card pl-9"
            placeholder="Buscar por nome, documento, e-mail, telefone ou cidade"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="client-type" className="sr-only">
          Filtrar por tipo
        </FieldLabel>

        <Select
          value={params.type ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              type: value === ALL_OPTION ? undefined : (value as ClientType),
            })
          }
        >
          <SelectTrigger id="client-type" className="w-full bg-card">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todos os tipos</SelectItem>

            {Object.values(ClientType).map((type) => (
              <SelectItem key={type} value={type}>
                {clientTypeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="client-status" className="sr-only">
          Filtrar por status
        </FieldLabel>

        <Select
          value={params.status ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              status:
                value === ALL_OPTION ? undefined : (value as ClientStatus),
            })
          }
        >
          <SelectTrigger id="client-status" className="w-full bg-card">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todos os status</SelectItem>

            {Object.values(ClientStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {clientStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="client-responsible" className="sr-only">
          Filtrar por responsável
        </FieldLabel>

        <Select
          value={params.responsibleId ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              responsibleId: value === ALL_OPTION ? undefined : value,
            })
          }
        >
          <SelectTrigger id="client-responsible" className="w-full bg-card">
            <SelectValue placeholder="Todos os responsáveis" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todos os responsáveis</SelectItem>

            {responsibles.map((responsible) => (
              <SelectItem key={responsible.id} value={responsible.id}>
                {responsible.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* O filtro de UF só aparece quando há mais de uma na carteira — com
          uma única UF ele não separaria nada. */}
      {states.length > 1 ? (
        <Field>
          <FieldLabel htmlFor="client-state" className="sr-only">
            Filtrar por UF
          </FieldLabel>

          <Select
            value={params.state ?? ALL_OPTION}
            onValueChange={(value) =>
              applyFilter({ state: value === ALL_OPTION ? undefined : value })
            }
          >
            <SelectTrigger id="client-state" className="w-full bg-card">
              <SelectValue placeholder="UF" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_OPTION}>Todas as UFs</SelectItem>

              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      ) : null}

      {hasActiveClientFilters(params) ? (
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          disabled={isPending}
        >
          <X aria-hidden="true" />
          Limpar
        </Button>
      ) : null}
    </div>
  );
};
