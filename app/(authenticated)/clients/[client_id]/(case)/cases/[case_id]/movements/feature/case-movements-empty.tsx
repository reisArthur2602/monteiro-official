import { GitCommitHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

import { buildCaseMovementsFilterHref } from '../utils/build-case-movements-href';

type CaseMovementsEmptyProps = {
    clientId: string;
    caseId: string;
    hasFilters: boolean;
};

export const CaseMovementsEmpty = ({ clientId, caseId, hasFilters }: CaseMovementsEmptyProps) => (
    <Empty className="border-0">
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <GitCommitHorizontal />
            </EmptyMedia>

            <EmptyTitle>
                {hasFilters ? 'Nenhuma movimentação encontrada' : 'Nenhuma movimentação registrada'}
            </EmptyTitle>

            <EmptyDescription>
                {hasFilters
                    ? 'Revise a busca ou selecione outra origem.'
                    : 'Registre o primeiro andamento deste processo.'}
            </EmptyDescription>
        </EmptyHeader>

        {hasFilters ? (
            <EmptyContent>
                <Button asChild variant="outline">
                    <Link href={buildCaseMovementsFilterHref(clientId, caseId, {})} scroll={false}>
                        Limpar filtros
                    </Link>
                </Button>
            </EmptyContent>
        ) : null}
    </Empty>
);
