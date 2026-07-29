"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { TemplateCategory, TemplateStatus } from "@/app/generated/prisma/enums";
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

import type { ListTemplatesParams } from "../schemas/list-templates-params-schema";
import {
  buildTemplatesHref,
  hasActiveTemplateFilters,
  TEMPLATES_PATH,
} from "../utils/build-templates-href";
import {
  templateCategoryLabels,
  templateStatusLabels,
} from "../utils/template-labels";

const ALL_OPTION = "all";
const SEARCH_DEBOUNCE_MS = 400;

type TemplatesFiltersProps = {
  params: ListTemplatesParams;
  legalAreas: string[];
};

export const TemplatesFilters = ({
  params,
  legalAreas,
}: TemplatesFiltersProps) => {
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
          buildTemplatesHref({
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

  const applyFilter = (patch: Partial<ListTemplatesParams>) => {
    startTransition(() => {
      router.replace(
        buildTemplatesHref({
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
      router.replace(TEMPLATES_PATH, { scroll: false });
    });
  };

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,11rem))_auto]">
      <Field>
        <FieldLabel htmlFor="template-search" className="sr-only">
          Buscar template
        </FieldLabel>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="template-search"
            type="search"
            className="bg-card pl-9"
            placeholder="Buscar por nome, descrição ou área"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="template-category" className="sr-only">
          Filtrar por categoria
        </FieldLabel>

        <Select
          value={params.category ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              category:
                value === ALL_OPTION ? undefined : (value as TemplateCategory),
            })
          }
        >
          <SelectTrigger id="template-category" className="w-full bg-card">
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

      <Field>
        <FieldLabel htmlFor="template-area" className="sr-only">
          Filtrar por área
        </FieldLabel>

        <Select
          value={params.area ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({ area: value === ALL_OPTION ? undefined : value })
          }
        >
          <SelectTrigger id="template-area" className="w-full bg-card">
            <SelectValue placeholder="Todas as áreas" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todas as áreas</SelectItem>

            {legalAreas.map((legalArea) => (
              <SelectItem key={legalArea} value={legalArea}>
                {legalArea}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="template-status" className="sr-only">
          Filtrar por status
        </FieldLabel>

        <Select
          value={params.status ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              status:
                value === ALL_OPTION ? undefined : (value as TemplateStatus),
            })
          }
        >
          <SelectTrigger id="template-status" className="w-full bg-card">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todos os status</SelectItem>

            {Object.values(TemplateStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {templateStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {hasActiveTemplateFilters(params) ? (
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          disabled={isPending}
        >
          <X aria-hidden="true" />
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
};
