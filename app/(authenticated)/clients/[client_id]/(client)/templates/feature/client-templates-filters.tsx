"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { templateCategoryLabels } from "@/app/(authenticated)/templates/utils/template-labels";
import { TemplateCategory } from "@/app/generated/prisma/enums";
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

import type { ListClientTemplatesParams } from "../schemas/list-client-templates-params-schema";
import {
  buildClientTemplatesFilterHref,
  hasActiveClientTemplatesFilters,
} from "../utils/build-client-templates-href";

const ALL_OPTION = "all";
const SEARCH_DEBOUNCE_MS = 400;

type ClientTemplatesFiltersProps = {
  clientId: string;
  params: ListClientTemplatesParams;
};

export const ClientTemplatesFilters = ({
  clientId,
  params,
}: ClientTemplatesFiltersProps) => {
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
          buildClientTemplatesFilterHref(clientId, {
            ...params,
            search: value || undefined,
          }),
          { scroll: false },
        );
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [search, currentSearch, params, clientId, router]);

  const applyCategory = (value: string) => {
    startTransition(() => {
      router.replace(
        buildClientTemplatesFilterHref(clientId, {
          ...params,
          search: search.trim() || undefined,
          category:
            value === ALL_OPTION ? undefined : (value as TemplateCategory),
        }),
        { scroll: false },
      );
    });
  };

  const clearFilters = () => {
    setSearch("");

    startTransition(() => {
      router.replace(buildClientTemplatesFilterHref(clientId, {}), {
        scroll: false,
      });
    });
  };

  return (
    <div className="grid gap-3 rounded-xl border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
      <Field>
        <FieldLabel htmlFor="client-template-search" className="sr-only">
          Buscar modelos
        </FieldLabel>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="client-template-search"
            type="search"
            className="pl-9"
            placeholder="Buscar por nome ou finalidade"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="client-template-category" className="sr-only">
          Filtrar por categoria
        </FieldLabel>

        <Select
          value={params.category ?? ALL_OPTION}
          onValueChange={applyCategory}
        >
          <SelectTrigger id="client-template-category" className="w-full">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todas as categorias</SelectItem>

            {Object.values(TemplateCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {templateCategoryLabels[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {hasActiveClientTemplatesFilters(params) ? (
        <Button type="button" variant="ghost" onClick={clearFilters}>
          <X aria-hidden="true" />
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
};
