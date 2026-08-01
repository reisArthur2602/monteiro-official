"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { ProcessStatus, ProcessType } from "@/app/generated/prisma/enums";
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

import type { ListClientCasesParams } from "../schemas/list-client-cases-params-schema";
import { buildCasesHref, hasActiveCasesFilters } from "../utils/build-cases-href";
import { processStatusLabels, processTypeLabels } from "../utils/case-labels";

const ALL_OPTION = "all";
const SEARCH_DEBOUNCE_MS = 400;

type CasesFiltersProps = {
  clientId: string;
  params: ListClientCasesParams;
  legalAreas: string[];
  responsibles: { id: string; name: string }[];
};

export const CasesFilters = ({
  clientId,
  params,
  legalAreas,
  responsibles,
}: CasesFiltersProps) => {
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
          buildCasesHref(clientId, {
            ...params,
            search: value || undefined,
            page: 1,
          }),
          { scroll: false },
        );
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [search, currentSearch, params, clientId, router]);

  const applyFilter = (patch: Partial<ListClientCasesParams>) => {
    startTransition(() => {
      router.replace(
        buildCasesHref(clientId, {
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
      router.replace(buildCasesHref(clientId, {}), { scroll: false });
    });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,10rem))_auto]">
      <Field>
        <FieldLabel htmlFor="case-search" className="sr-only">
          Buscar processo
        </FieldLabel>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="case-search"
            type="search"
            className="bg-card pl-9"
            placeholder="Buscar por número, assunto, vara ou responsável"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="case-status" className="sr-only">
          Filtrar por status
        </FieldLabel>

        <Select
          value={params.status ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              status:
                value === ALL_OPTION ? undefined : (value as ProcessStatus),
            })
          }
        >
          <SelectTrigger id="case-status" className="w-full bg-card">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todos os status</SelectItem>

            {Object.values(ProcessStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {processStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {legalAreas.length > 1 ? (
        <Field>
          <FieldLabel htmlFor="case-legal-area" className="sr-only">
            Filtrar por área
          </FieldLabel>

          <Select
            value={params.legalArea ?? ALL_OPTION}
            onValueChange={(value) =>
              applyFilter({
                legalArea: value === ALL_OPTION ? undefined : value,
              })
            }
          >
            <SelectTrigger id="case-legal-area" className="w-full bg-card">
              <SelectValue placeholder="Todas as áreas" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_OPTION}>Todas as áreas</SelectItem>

              {legalAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      ) : null}

      {responsibles.length > 1 ? (
        <Field>
          <FieldLabel htmlFor="case-responsible" className="sr-only">
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
            <SelectTrigger id="case-responsible" className="w-full bg-card">
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
      ) : null}

      <Field>
        <FieldLabel htmlFor="case-type" className="sr-only">
          Filtrar por tipo
        </FieldLabel>

        <Select
          value={params.type ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              type: value === ALL_OPTION ? undefined : (value as ProcessType),
            })
          }
        >
          <SelectTrigger id="case-type" className="w-full bg-card">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todos os tipos</SelectItem>

            {Object.values(ProcessType).map((type) => (
              <SelectItem key={type} value={type}>
                {processTypeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {hasActiveCasesFilters(params) ? (
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
