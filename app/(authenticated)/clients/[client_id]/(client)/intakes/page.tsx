import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';

import { clientIdSchema } from '../schemas/client-id-schema';
import { AttendanceFormsFilters } from './feature/attendance-forms-filters';
import { AttendanceFormsGrid } from './feature/attendance-forms-grid';
import { AttendanceFormsGridSkeleton } from './feature/attendance-forms-grid-skeleton';
import { AttendanceFormsSummary } from './feature/attendance-forms-summary';
import { listAttendanceFormLegalAreas } from './queries/list-attendance-form-legal-areas';
import { listAttendanceFormsParamsSchema } from './schemas/list-attendance-forms-params-schema';
import { buildIntakeUpsertHref } from './utils/build-intakes-href';

export const metadata: Metadata = {
    title: 'Fichas',
};

type IntakesPageProps = {
    params: Promise<{ client_id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const IntakesPage = async ({ params, searchParams }: IntakesPageProps) => {
    const { client_id: rawClientId } = await params;
    const parsedId = clientIdSchema.safeParse(rawClientId);

    // O layout já validou o cliente; isto só protege esta rota caso seja
    // acessada de outro ponto sem passar pelo layout.
    if (!parsedId.success) {
        notFound();
    }

    const clientId = parsedId.data;
    const filterParams = listAttendanceFormsParamsSchema.parse(await searchParams);
    const legalAreas = await listAttendanceFormLegalAreas(clientId);

    return (
        <div className="grid gap-4">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="grid gap-1">
                    <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
                        Documentação estruturada
                    </span>

                    <h2 className="font-heading text-2xl font-semibold tracking-tight">
                        Fichas do cliente
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Registros de atendimento vinculados a este cliente.
                    </p>
                </div>

                <Button asChild>
                    <Link href={buildIntakeUpsertHref(clientId)}>
                        <Plus aria-hidden="true" />
                        Nova ficha
                    </Link>
                </Button>
            </header>

            <AttendanceFormsSummary clientId={clientId} />

            <AttendanceFormsFilters
                clientId={clientId}
                params={filterParams}
                legalAreas={legalAreas}
            />

            {/*
        A `key` refaz o boundary a cada combinação de filtros, então a
        troca de filtro mostra o skeleton em vez de congelar a lista
        anterior até a nova consulta responder.
      */}
            <Suspense key={JSON.stringify(filterParams)} fallback={<AttendanceFormsGridSkeleton />}>
                <AttendanceFormsGrid clientId={clientId} params={filterParams} />
            </Suspense>
        </div>
    );
};

export default IntakesPage;
