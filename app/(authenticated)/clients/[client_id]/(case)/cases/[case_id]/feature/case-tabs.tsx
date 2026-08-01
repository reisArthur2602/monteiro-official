'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { buildClientCaseHref } from '../../../../(client)/cases/utils/build-cases-href';

type CaseTabsProps = {
    clientId: string;
    caseId: string;
};

/**
 * Abas do processo. Só entra "Visão geral" por ora — Movimentações,
 * Documentos, Prazos, Partes e Atividade ganham aba quando a rota de cada
 * uma existir, para não linkar para lugar nenhum.
 */
export const CaseTabs = ({ clientId, caseId }: CaseTabsProps) => {
    const pathname = usePathname();

    const tabs = [{ label: 'Visão geral', href: buildClientCaseHref(clientId, caseId) }];

    return (
        <nav
            aria-label="Navegação do processo"
            className="sticky top-16 z-20 -mx-4 flex gap-1 overflow-x-auto border-b bg-background/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                            'relative flex min-h-11 items-center gap-2 border-b-2 border-transparent px-3 text-sm font-semibold whitespace-nowrap text-muted-foreground hover:text-foreground',
                            isActive && 'border-primary text-foreground'
                        )}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
};
