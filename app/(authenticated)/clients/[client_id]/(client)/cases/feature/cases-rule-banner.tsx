import { Scale } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { buildClientIntakesHref } from '../../../../utils/build-clients-href';

type CasesRuleBannerProps = {
    clientId: string;
};

/**
 * Explica por que não existe "novo processo" nesta tela: o schema garante
 * um processo por ficha (`attendanceFormId @unique`), então a criação
 * começa sempre na ficha finalizada.
 */
export const CasesRuleBanner = ({ clientId }: CasesRuleBannerProps) => (
    <aside className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-primary/20 bg-accent p-3.5 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-lg bg-card text-primary"
        >
            <Scale className="size-4" />
        </span>

        <div>
            <strong className="block text-[11px] font-semibold">
                O processo é criado a partir de uma ficha finalizada
            </strong>

            <small className="mt-0.5 block text-[9px] text-muted-foreground">
                Cada ficha pode originar somente um processo. Abra a ficha correspondente para
                iniciar um novo cadastro.
            </small>
        </div>

        <Button asChild variant="outline" size="sm" className="max-sm:hidden">
            <Link href={buildClientIntakesHref(clientId)}>Abrir fichas</Link>
        </Button>
    </aside>
);
