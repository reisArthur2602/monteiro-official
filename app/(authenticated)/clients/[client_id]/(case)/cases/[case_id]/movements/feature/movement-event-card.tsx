'use client';

import { Cog, FileCheck2, FileInput, Landmark, MoreHorizontal, Trash2 } from 'lucide-react';
import type { ComponentType } from 'react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import type { ProcessMovementSource } from '@/app/generated/prisma/enums';
import type { CaseMovementListItem } from '../queries/list-case-movements';
import { formatDateTime } from '../../utils/format-date-time';
import { processMovementSourceBadgeClasses, processMovementSourceLabels } from '../utils/movement-labels';
import { MovementDeleteDialog } from './movement-delete-dialog';

const SOURCE_ICONS: Record<ProcessMovementSource, ComponentType<{ className?: string }>> = {
    TRIBUNAL: Landmark,
    MANUAL: FileCheck2,
    SISTEMA: Cog,
    IMPORTACAO: FileInput,
};

const SOURCE_MARKER_CLASSES: Record<ProcessMovementSource, string> = {
    TRIBUNAL: 'border-primary/25 bg-accent text-primary',
    MANUAL: 'border-chart-2/25 bg-chart-2/12 text-chart-2',
    IMPORTACAO: 'border-chart-3/25 bg-chart-3/12 text-chart-3',
    SISTEMA: 'border-border bg-muted text-muted-foreground',
};

type MovementEventCardProps = {
    clientId: string;
    caseId: string;
    movement: CaseMovementListItem;
    isLatest: boolean;
    isLastInGroup: boolean;
};

export const MovementEventCard = ({
    clientId,
    caseId,
    movement,
    isLatest,
    isLastInGroup,
}: MovementEventCardProps) => {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const Icon = SOURCE_ICONS[movement.source];
    const { time } = formatDateTime(movement.movementAt);

    return (
        <div className="grid grid-cols-[2.625rem_minmax(0,1fr)] gap-3">
            <div className="relative flex justify-center pt-4.5" aria-hidden="true">
                {!isLastInGroup ? (
                    <span className="absolute top-5.5 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border" />
                ) : null}

                <span
                    className={cn(
                        'relative z-10 grid size-7.5 place-items-center rounded-[0.6rem] border-4 border-background',
                        SOURCE_MARKER_CLASSES[movement.source]
                    )}
                >
                    <Icon className="size-3.5" />
                </span>
            </div>

            <article
                className={cn(
                    'overflow-hidden rounded-xl border bg-card',
                    isLatest && 'border-primary/30 bg-accent/40'
                )}
            >
                <header className="flex items-start justify-between gap-3.5 px-4 pt-3.5">
                    <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            <time
                                dateTime={movement.movementAt}
                                className="font-mono text-[10px] font-semibold text-muted-foreground"
                            >
                                {time}
                            </time>

                            <Badge
                                variant="outline"
                                className={cn(
                                    'font-bold',
                                    processMovementSourceBadgeClasses[movement.source]
                                )}
                            >
                                {processMovementSourceLabels[movement.source]}
                            </Badge>

                            {isLatest ? (
                                <Badge className="bg-primary font-bold text-primary-foreground">
                                    Mais recente
                                </Badge>
                            ) : null}
                        </div>

                        <h3 className="truncate font-heading text-lg leading-tight font-semibold tracking-tight">
                            {movement.title}
                        </h3>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="-mt-1 shrink-0 text-muted-foreground"
                                aria-label={`Mais ações para ${movement.title}`}
                            >
                                <MoreHorizontal aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => setIsDeleteOpen(true)}
                            >
                                <Trash2 aria-hidden="true" />
                                Remover
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                <p className="mt-2 px-4 text-xs leading-relaxed text-muted-foreground">
                    {movement.description}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 px-4 pb-3.5">
                    <span className="grid gap-0.5">
                        <strong className="font-mono text-[8px] font-semibold tracking-wider text-muted-foreground uppercase">
                            Registrado por
                        </strong>
                        <span className="text-[10px]">{movement.createdBy.name}</span>
                    </span>

                    {movement.externalCode ? (
                        <span className="grid gap-0.5">
                            <strong className="font-mono text-[8px] font-semibold tracking-wider text-muted-foreground uppercase">
                                Código externo
                            </strong>
                            <span className="font-mono text-[10px]">{movement.externalCode}</span>
                        </span>
                    ) : null}
                </div>
            </article>

            <MovementDeleteDialog
                clientId={clientId}
                caseId={caseId}
                movementId={movement.id}
                title={movement.title}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            />
        </div>
    );
};
