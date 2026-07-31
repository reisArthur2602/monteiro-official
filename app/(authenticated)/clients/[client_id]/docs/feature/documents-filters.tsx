"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import {
  ClientDocumentCategory,
  ClientDocumentStatus,
  ClientDocumentVisibility,
} from "@/app/generated/prisma/enums";
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

import type { ListClientDocumentsParams } from "../schemas/list-client-documents-params-schema";
import { buildDocsHref, hasActiveDocsFilters } from "../utils/build-docs-href";
import {
  clientDocumentCategoryLabels,
  clientDocumentStatusLabels,
  clientDocumentVisibilityLabels,
} from "../utils/document-labels";

const ALL_OPTION = "all";
const SEARCH_DEBOUNCE_MS = 400;

type DocumentsFiltersProps = {
  clientId: string;
  params: ListClientDocumentsParams;
};

export const DocumentsFilters = ({
  clientId,
  params,
}: DocumentsFiltersProps) => {
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
          buildDocsHref(clientId, {
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

  const applyFilter = (patch: Partial<ListClientDocumentsParams>) => {
    startTransition(() => {
      router.replace(
        buildDocsHref(clientId, {
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
      router.replace(buildDocsHref(clientId, {}), { scroll: false });
    });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,10rem))_auto]">
      <Field>
        <FieldLabel htmlFor="document-search" className="sr-only">
          Buscar documento
        </FieldLabel>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            id="document-search"
            type="search"
            className="bg-card pl-9"
            placeholder="Buscar por título, categoria, tag ou responsável"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel htmlFor="document-category" className="sr-only">
          Filtrar por categoria
        </FieldLabel>

        <Select
          value={params.category ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              category:
                value === ALL_OPTION
                  ? undefined
                  : (value as ClientDocumentCategory),
            })
          }
        >
          <SelectTrigger id="document-category" className="w-full bg-card">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todas as categorias</SelectItem>

            {Object.values(ClientDocumentCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {clientDocumentCategoryLabels[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="document-visibility" className="sr-only">
          Filtrar por visibilidade
        </FieldLabel>

        <Select
          value={params.visibility ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              visibility:
                value === ALL_OPTION
                  ? undefined
                  : (value as ClientDocumentVisibility),
            })
          }
        >
          <SelectTrigger id="document-visibility" className="w-full bg-card">
            <SelectValue placeholder="Todas as visibilidades" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todas as visibilidades</SelectItem>

            {Object.values(ClientDocumentVisibility).map((visibility) => (
              <SelectItem key={visibility} value={visibility}>
                {clientDocumentVisibilityLabels[visibility]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="document-status" className="sr-only">
          Filtrar por status
        </FieldLabel>

        <Select
          value={params.status ?? ALL_OPTION}
          onValueChange={(value) =>
            applyFilter({
              status:
                value === ALL_OPTION
                  ? undefined
                  : (value as ClientDocumentStatus),
            })
          }
        >
          <SelectTrigger id="document-status" className="w-full bg-card">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_OPTION}>Todos os status</SelectItem>

            {Object.values(ClientDocumentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {clientDocumentStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {hasActiveDocsFilters(params) ? (
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
