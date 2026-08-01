'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { ListCaseDocumentsParams } from '../schemas/list-case-documents-params-schema';
import { buildCaseDocsFilterHref, hasActiveCaseDocsFilters } from '../utils/build-case-docs-href';
import {
    DOCUMENT_FORMATS,
    type DocumentFormat,
    documentFormatFilterLabels,
} from '../utils/document-format';

const ALL_OPTION = 'all';
const SEARCH_DEBOUNCE_MS = 400;

type CaseDocsToolbarProps = {
    clientId: string;
    caseId: string;
    params: ListCaseDocumentsParams;
};

/**
 * Busca e filtro de formato do explorador. A pasta continua sendo escolhida
 * na árvore lateral, então ela não aparece aqui — mas é preservada em cada
 * navegação para que buscar dentro de uma pasta não jogue o usuário de
 * volta para a raiz.
 */
export const CaseDocsToolbar = ({ clientId, caseId, params }: CaseDocsToolbarProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [search, setSearch] = useState(params.search ?? '');

    const currentSearch = params.search ?? '';

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
                    buildCaseDocsFilterHref(clientId, caseId, {
                        ...params,
                        search: value || undefined,
                        page: 1,
                    }),
                    { scroll: false }
                );
            });
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
    }, [search, currentSearch, params, clientId, caseId, router]);

    const applyFormat = (format: DocumentFormat | undefined) => {
        startTransition(() => {
            router.replace(
                buildCaseDocsFilterHref(clientId, caseId, {
                    ...params,
                    search: search.trim() || undefined,
                    format,
                    page: 1,
                }),
                { scroll: false }
            );
        });
    };

    const clearFilters = () => {
        setSearch('');

        startTransition(() => {
            router.replace(buildCaseDocsFilterHref(clientId, caseId, {}), { scroll: false });
        });
    };

    return (
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            <Field className="min-w-56 flex-1 sm:max-w-md">
                <FieldLabel htmlFor="case-document-search" className="sr-only">
                    Buscar documento
                </FieldLabel>

                <div className="relative">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        id="case-document-search"
                        type="search"
                        className="bg-card pl-9"
                        placeholder="Buscar por nome, descrição ou arquivo"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </Field>

            <Field className="w-full sm:w-44">
                <FieldLabel htmlFor="case-document-format" className="sr-only">
                    Filtrar por formato
                </FieldLabel>

                <Select
                    value={params.format ?? ALL_OPTION}
                    onValueChange={(value) =>
                        applyFormat(value === ALL_OPTION ? undefined : (value as DocumentFormat))
                    }
                >
                    <SelectTrigger id="case-document-format" className="w-full bg-card">
                        <SelectValue placeholder="Todos os formatos" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value={ALL_OPTION}>Todos os formatos</SelectItem>

                        {DOCUMENT_FORMATS.map((format) => (
                            <SelectItem key={format} value={format}>
                                {documentFormatFilterLabels[format]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            {hasActiveCaseDocsFilters(params) ? (
                <Button type="button" variant="ghost" onClick={clearFilters} disabled={isPending}>
                    <X aria-hidden="true" />
                    Limpar
                </Button>
            ) : null}
        </div>
    );
};
