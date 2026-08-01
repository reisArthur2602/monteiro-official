import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { redirectAuth } from '@/utils/auth';

import { clientIdSchema } from '../../../(client)/schemas/client-id-schema';
import { CaseContextHeader } from './feature/case-context-header';
import { CaseTabs } from './feature/case-tabs';
import { getCaseContext } from './queries/get-case-context';
import { caseIdSchema } from './schemas/case-id-schema';

type CaseLayoutProps = PropsWithChildren<{
    params: Promise<{ client_id: string; case_id: string }>;
}>;

const CaseLayout = async ({ children, params }: CaseLayoutProps) => {
    await redirectAuth();

    const { client_id: rawClientId, case_id: rawCaseId } = await params;

    const parsedClientId = clientIdSchema.safeParse(rawClientId);
    const parsedCaseId = caseIdSchema.safeParse(rawCaseId);

    // Um id malformado não chega ao banco: a rota simplesmente não existe
    // para aquele endereço.
    if (!parsedClientId.success || !parsedCaseId.success) {
        notFound();
    }

    const item = await getCaseContext(parsedClientId.data, parsedCaseId.data);

    if (!item) {
        notFound();
    }

    return (
        <div className="grid gap-5">
            <CaseContextHeader item={item} />

            <CaseTabs clientId={item.client.id} caseId={item.id} />

            {children}
        </div>
    );
};

export default CaseLayout;
