'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { AttendanceFormStatus } from '@/app/generated/prisma/enums';
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

import { attendanceFormStatusLabels } from '../../utils/attendance-form-labels';
import type { ListAttendanceFormsParams } from '../schemas/list-attendance-forms-params-schema';
import { buildIntakesHref, hasActiveIntakesFilters } from '../utils/build-intakes-href';

const ALL_OPTION = 'all';
const SEARCH_DEBOUNCE_MS = 400;

type AttendanceFormsFiltersProps = {
    clientId: string;
    params: ListAttendanceFormsParams;
    legalAreas: string[];
};

export const AttendanceFormsFilters = ({
    clientId,
    params,
    legalAreas,
}: AttendanceFormsFiltersProps) => {
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
                    buildIntakesHref(clientId, {
                        ...params,
                        search: value || undefined,
                        page: 1,
                    }),
                    { scroll: false }
                );
            });
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
    }, [search, currentSearch, params, clientId, router]);

    const applyFilter = (patch: Partial<ListAttendanceFormsParams>) => {
        startTransition(() => {
            router.replace(
                buildIntakesHref(clientId, {
                    ...params,
                    search: search.trim() || undefined,
                    ...patch,
                    page: 1,
                }),
                { scroll: false }
            );
        });
    };

    const clearFilters = () => {
        setSearch('');

        startTransition(() => {
            router.replace(buildIntakesHref(clientId, {}), { scroll: false });
        });
    };

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(2,minmax(0,11rem))_auto]">
            <Field>
                <FieldLabel htmlFor="intake-search" className="sr-only">
                    Buscar ficha
                </FieldLabel>

                <div className="relative">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                        id="intake-search"
                        type="search"
                        className="bg-card pl-9"
                        placeholder="Buscar por assunto, contato ou relato"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
            </Field>

            <Field>
                <FieldLabel htmlFor="intake-status" className="sr-only">
                    Filtrar por status
                </FieldLabel>

                <Select
                    value={params.status ?? ALL_OPTION}
                    onValueChange={(value) =>
                        applyFilter({
                            status:
                                value === ALL_OPTION ? undefined : (value as AttendanceFormStatus),
                        })
                    }
                >
                    <SelectTrigger id="intake-status" className="w-full bg-card">
                        <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value={ALL_OPTION}>Todos os status</SelectItem>

                        {Object.values(AttendanceFormStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                                {attendanceFormStatusLabels[status]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            {legalAreas.length > 1 ? (
                <Field>
                    <FieldLabel htmlFor="intake-legal-area" className="sr-only">
                        Filtrar por área jurídica
                    </FieldLabel>

                    <Select
                        value={params.legalArea ?? ALL_OPTION}
                        onValueChange={(value) =>
                            applyFilter({
                                legalArea: value === ALL_OPTION ? undefined : value,
                            })
                        }
                    >
                        <SelectTrigger id="intake-legal-area" className="w-full bg-card">
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

            {hasActiveIntakesFilters(params) ? (
                <Button type="button" variant="ghost" onClick={clearFilters} disabled={isPending}>
                    <X aria-hidden="true" />
                    Limpar
                </Button>
            ) : null}
        </div>
    );
};
