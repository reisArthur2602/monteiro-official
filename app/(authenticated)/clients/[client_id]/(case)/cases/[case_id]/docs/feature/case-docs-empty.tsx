import { FolderOpen } from 'lucide-react';
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

import { buildCaseDocsFilterHref } from '../utils/build-case-docs-href';

type CaseDocsEmptyProps = {
    clientId: string;
    caseId: string;
    hasFilters: boolean;
};

export const CaseDocsEmpty = ({ clientId, caseId, hasFilters }: CaseDocsEmptyProps) => (
    <Empty className="border-0">
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <FolderOpen />
            </EmptyMedia>

            <EmptyTitle>
                {hasFilters ? 'Nenhum item encontrado' : 'Nenhum documento no processo'}
            </EmptyTitle>

            <EmptyDescription>
                {hasFilters
                    ? 'Revise a busca, o formato selecionado ou troque de pasta.'
                    : 'Envie o primeiro documento para o repositório deste processo.'}
            </EmptyDescription>
        </EmptyHeader>

        {hasFilters ? (
            <EmptyContent>
                <Button asChild variant="outline">
                    <Link href={buildCaseDocsFilterHref(clientId, caseId, {})} scroll={false}>
                        Limpar filtros
                    </Link>
                </Button>
            </EmptyContent>
        ) : null}
    </Empty>
);
