'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { ProcessMovementSource } from '@/app/generated/prisma/enums';
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

import type { ListCaseMovementsParams } from '../schemas/list-case-movements-params-schema';
import {
    buildCaseMovementsFilterHref,
    hasActiveCaseMovementsFilters,
} from '../utils/build-case-movements-href';
import { processMovementSourceLabels } from '../utils/movement-labels';

const ALL_OPTION = 'all';
const SEARCH_DEBOUNCE_MS = 400;

type CaseMovementsToolbarProps = {
    clientId: string;
    caseId: string;
    params: ListCaseMovementsParams;
    total: number;
    visibleCount: number;
};

export const CaseMovementsToolbar = ({
    clientId,
    caseId,
    params,
    total,
    visibleCount,
}: CaseMovementsToolbarProps) => {
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
                    buildCaseMovementsFilterHref(clientId, caseId, {
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

    const applySource = (source: ProcessMovementSource | undefined) => {
        startTransition(() => {
            router.replace(
                buildCaseMovementsFilterHref(clientId, caseId, {
                    ...params,
                    search: search.trim() || undefined,
                    source,
                    page: 1,
                }),
                { scroll: false }
            );
        });
    };

    const clearFilters = () => {
        setSearch('');

        startTransition(() => {
            router.replace(buildCaseMovementsFilterHref(clientId, caseId, {}), { scroll: false });
        });
    };

    return (
        <header className="grid gap-3 border-b p-3.5 sm:grid-cols-[minmax(0,1fr)_11rem_auto] sm:items-center">
            <Field>
                <FieldLabel htmlFor="movement-search" className="sr-only">
                    Buscar movimentações
                </FieldLabel>

                <div className="relative">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        id="movement-search"
                        type="search"
                        className="bg-card pl-9"
                        placeholder="Buscar por título ou descrição"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </Field>

            <Field>
                <FieldLabel htmlFor="movement-source" className="sr-only">
                    Filtrar por origem
                </FieldLabel>

                <Select
                    value={params.source ?? ALL_OPTION}
                    onValueChange={(value) =>
                        applySource(
                            value === ALL_OPTION ? undefined : (value as ProcessMovementSource)
                        )
                    }
                >
                    <SelectTrigger id="movement-source" className="w-full bg-card">
                        <SelectValue placeholder="Todas as origens" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value={ALL_OPTION}>Todas as origens</SelectItem>

                        {Object.values(ProcessMovementSource).map((source) => (
                            <SelectItem key={source} value={source}>
                                {processMovementSourceLabels[source]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="text-nowrap text-[10px] text-muted-foreground">
                    <strong className="text-foreground">{visibleCount}</strong> exibidas · {total}{' '}
                    no total
                </p>

                {hasActiveCaseMovementsFilters(params) ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        disabled={isPending}
                    >
                        <X aria-hidden="true" />
                        Limpar
                    </Button>
                ) : null}
            </div>
        </header>
    );
};
