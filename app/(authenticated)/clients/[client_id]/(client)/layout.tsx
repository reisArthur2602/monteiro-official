import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { redirectAuth } from '@/utils/auth';

import { summarizeClientCases } from './cases/queries/summarize-client-cases';
import { summarizeClientDocuments } from './docs/queries/summarize-client-documents';
import { ClientContextHeader } from './feature/client-context-header';
import { ClientTabs } from './feature/client-tabs';
import { summarizeClientAttendanceForms } from './intakes/queries/summarize-client-attendance-forms';
import { getClientContext } from './queries/get-client-context';
import { clientIdSchema } from './schemas/client-id-schema';

type ClientLayoutProps = PropsWithChildren<{
    params: Promise<{ client_id: string }>;
}>;

const ClientLayout = async ({ children, params }: ClientLayoutProps) => {
    await redirectAuth();

    const { client_id: rawClientId } = await params;
    const parsedId = clientIdSchema.safeParse(rawClientId);

    // Um id malformado não chega ao banco: a rota simplesmente não existe
    // para aquele endereço.
    if (!parsedId.success) {
        notFound();
    }

    const client = await getClientContext(parsedId.data);

    if (!client) {
        notFound();
    }

    const [{ total: intakesCount }, { total: documentsCount }, { total: casesCount }] =
        await Promise.all([
            summarizeClientAttendanceForms(client.id),
            summarizeClientDocuments(client.id),
            summarizeClientCases(client.id),
        ]);

    return (
        <div className="grid gap-5">
            <ClientContextHeader client={client} />

            <ClientTabs
                clientId={client.id}
                intakesCount={intakesCount}
                documentsCount={documentsCount}
                casesCount={casesCount}
            />

            {children}
        </div>
    );
};

export default ClientLayout;
