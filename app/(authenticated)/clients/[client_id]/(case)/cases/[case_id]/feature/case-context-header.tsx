import { ArrowLeft, SquarePen } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { buildCaseEditHref, buildClientCasesHref } from '../../../../(client)/cases/utils/build-cases-href';
import {
    processClientRoleLabels,
    processStatusBadgeClasses,
    processStatusLabels,
    processTypeLabels,
} from '../../../../(client)/cases/utils/case-labels';
import { formatDate } from '../../../../(client)/utils/format-date';
import { buildClientHref } from '../../../../../utils/build-clients-href';
import { formatDocument } from '../../../../../utils/format-document';
import type { CaseContext } from '../queries/get-case-context';

type CaseContextHeaderProps = {
    item: CaseContext;
};

export const CaseContextHeader = ({ item }: CaseContextHeaderProps) => {
    const forum = item.courtUnit ?? item.court;
    const clientName = item.client.displayName ?? item.client.name;

    return (
        <div className="grid gap-3">
            <Link
                href={buildClientCasesHref(item.client.id)}
                className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft aria-hidden="true" className="size-3.5" />
                Processos
            </Link>

            <section className="grid gap-5 rounded-2xl border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            className={cn('gap-1.5 font-bold', processStatusBadgeClasses[item.status])}
                        >
                            <span className="size-1.5 rounded-full bg-current" />
                            {processStatusLabels[item.status]}
                        </Badge>

                        <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                            {processTypeLabels[item.type]} · {item.legalArea}
                        </span>
                    </div>

                    <h1 className="mt-1 truncate font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                        {item.title}
                    </h1>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-mono">{item.internalCode}</span>

                        <span>{item.number ?? 'Sem número — aguardando distribuição'}</span>

                        {forum ? <span>{forum}</span> : null}

                        <span>{processClientRoleLabels[item.clientRole]}</span>

                        <span>Responsável: {item.responsible.name}</span>
                    </div>

                    <div className="mt-1.5 text-xs text-muted-foreground">
                        Cliente:{' '}
                        <Link
                            href={buildClientHref(item.client.id)}
                            className="font-medium text-foreground hover:underline"
                        >
                            {clientName}
                        </Link>{' '}
                        · {formatDocument(item.client.document)} · Aberto em {formatDate(item.createdAt)}
                    </div>
                </div>

                <Button asChild className="sm:self-center">
                    <Link href={buildCaseEditHref(item.client.id, item.id)}>
                        <SquarePen aria-hidden="true" />
                        Editar processo
                    </Link>
                </Button>
            </section>
        </div>
    );
};
