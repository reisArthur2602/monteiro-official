import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProcessStatus } from '@/app/generated/prisma/enums';
import { redirectAuth } from '@/utils/auth';

import { getClientContext } from '../../queries/get-client-context';
import { clientIdSchema } from '../../schemas/client-id-schema';
import { INITIAL_PROCESS_STATUSES } from '../utils/case-labels';
import { CaseOriginBlocked } from './feature/case-origin-blocked';
import { CaseUpsertScreen } from './feature/case-upsert-screen';
import { createEmptyCaseFormValues } from './mappers/case-form-mapper';
import { getAttendanceFormForCase } from './queries/get-attendance-form-for-case';
import { getCaseForEdit } from './queries/get-case-for-edit';
import { suggestInternalCode } from './queries/suggest-internal-code';
import { caseQuerySchema } from './schemas/case-query-schema';

export const metadata: Metadata = {
    title: 'Processo',
};

const ALL_STATUS_OPTIONS = Object.values(ProcessStatus);

type UpsertCasePageProps = {
    params: Promise<{ client_id: string }>;
    searchParams: Promise<{ formId?: string; caseId?: string }>;
};

const UpsertCasePage = async ({ params, searchParams }: UpsertCasePageProps) => {
    const user = await redirectAuth();

    const { client_id: rawClientId } = await params;
    const parsedClientId = clientIdSchema.safeParse(rawClientId);

    if (!parsedClientId.success) {
        notFound();
    }

    const clientId = parsedClientId.data;
    const client = await getClientContext(clientId);

    if (!client) {
        notFound();
    }

    const parsedQuery = caseQuerySchema.safeParse(await searchParams);

    if (!parsedQuery.success) {
        notFound();
    }

    const { formId, caseId } = parsedQuery.data;

    // Edição: a ficha de origem vem do próprio processo e é imutável.
    if (caseId) {
        const item = await getCaseForEdit(clientId, caseId);

        if (!item) {
            notFound();
        }

        return (
            <CaseUpsertScreen
                client={client}
                origin={item.origin}
                caseId={item.caseId}
                initialValues={item.values}
                statusOptions={ALL_STATUS_OPTIONS}
                responsibleName={item.responsibleName}
                createdAtLabel={new Date(item.createdAt).toLocaleDateString('pt-BR')}
            />
        );
    }

    // Cadastro: exige uma ficha de origem explícita na URL.
    if (!formId) {
        notFound();
    }

    const origin = await getAttendanceFormForCase(clientId, formId);

    if (!origin) {
        notFound();
    }

    if (origin.existingCaseId) {
        return (
            <CaseOriginBlocked
                clientId={clientId}
                formId={formId}
                reason="already-has-case"
                existingCaseId={origin.existingCaseId}
            />
        );
    }

    if (!origin.isFinalized) {
        return <CaseOriginBlocked clientId={clientId} formId={formId} reason="not-finalized" />;
    }

    const internalCode = await suggestInternalCode();

    return (
        <CaseUpsertScreen
            client={client}
            origin={origin}
            initialValues={createEmptyCaseFormValues({
                internalCode,
                legalArea: origin.legalArea ?? '',
                title: origin.subject ?? '',
            })}
            statusOptions={INITIAL_PROCESS_STATUSES}
            responsibleName={user.name}
            createdAtLabel="Definida automaticamente ao salvar"
        />
    );
};

export default UpsertCasePage;
