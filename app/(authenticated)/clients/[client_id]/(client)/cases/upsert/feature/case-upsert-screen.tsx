'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { ProcessStatus } from '@/app/generated/prisma/enums';
import { Button } from '@/components/ui/button';

import { formatDocument } from '../../../../../utils/format-document';
import { buildIntakeDetailHref } from '../../../intakes/utils/build-intakes-href';
import type { ClientContext } from '../../../queries/get-client-context';
import { buildCasesHref } from '../../utils/build-cases-href';
import { createCase } from '../actions/create-case';
import { updateCase } from '../actions/update-case';
import type { CaseFormValues } from '../schemas/case-form-schema';
import { CaseCourtPanel } from './case-court-panel';
import { CaseFormActions } from './case-form-actions';
import { CaseIdentificationPanel } from './case-identification-panel';
import { CaseMobileActions } from './case-mobile-actions';
import { type CaseOrigin, CaseOriginPanel } from './case-origin-panel';
import { CaseResponsibilityPanel } from './case-responsibility-panel';
import { CaseRuleNotes } from './case-rule-notes';
import { CaseSummaryCard } from './case-summary-card';

type CaseUpsertScreenProps = {
    client: ClientContext;
    origin: CaseOrigin;
    /** Presente só na edição. */
    caseId?: string;
    initialValues: CaseFormValues;
    statusOptions: ProcessStatus[];
    responsibleName: string;
    createdAtLabel: string;
};

const UNTITLED_INTAKE = 'Ficha sem assunto';

export const CaseUpsertScreen = ({
    client,
    origin,
    caseId,
    initialValues,
    statusOptions,
    responsibleName,
    createdAtLabel,
}: CaseUpsertScreenProps) => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<CaseFormValues>({
        defaultValues: initialValues,
        mode: 'onBlur',
    });

    const mode = caseId ? 'edit' : 'create';
    const clientName = client.displayName ?? client.name;

    const applyFieldErrors = (errors?: Record<string, string[] | undefined>) => {
        for (const [field, messages] of Object.entries(errors ?? {})) {
            const message = messages?.[0];

            if (message) {
                form.setError(field as keyof CaseFormValues, { message });
            }
        }
    };

    const handleSubmit = async () => {
        setIsPending(true);

        try {
            const values = form.getValues();

            const result = caseId
                ? await updateCase({ clientId: client.id, caseId, values })
                : await createCase({
                      clientId: client.id,
                      formId: origin.id,
                      values,
                  });

            if (!result.ok) {
                applyFieldErrors(result.errors);
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            router.push(buildCasesHref(client.id, {}));
        } catch {
            toast.error('Não foi possível concluir a operação');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="grid gap-6">
            <header className="flex flex-wrap items-end justify-between gap-6">
                <div className="grid max-w-2xl gap-2">
                    <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
                        {mode === 'edit' ? 'Edição do processo' : 'Novo processo'}
                    </span>

                    <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                        {mode === 'edit' ? 'Editar processo' : 'Cadastrar processo'}
                    </h1>

                    <p className="text-muted-foreground">
                        {mode === 'edit'
                            ? 'Atualize os dados do processo sem alterar o cliente ou a ficha que o originou.'
                            : 'O processo será criado para o cliente atual e vinculado permanentemente à ficha de origem.'}
                    </p>
                </div>

                <div className="hidden flex-wrap justify-end gap-2 sm:flex">
                    <Button asChild variant="outline">
                        <Link href={buildIntakeDetailHref(client.id, origin.id)}>
                            Voltar para a ficha
                        </Link>
                    </Button>

                    <Button type="button" disabled={isPending} onClick={handleSubmit}>
                        {isPending
                            ? 'Salvando…'
                            : mode === 'edit'
                              ? 'Salvar alterações'
                              : 'Criar processo'}
                    </Button>
                </div>
            </header>

            <FormProvider {...form}>
                <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="grid gap-4">
                        <CaseOriginPanel
                            origin={origin}
                            clientName={clientName}
                            clientDocument={formatDocument(client.document)}
                        />

                        <CaseIdentificationPanel statusOptions={statusOptions} />
                        <CaseCourtPanel />

                        <CaseResponsibilityPanel
                            responsibleName={responsibleName}
                            createdAtLabel={createdAtLabel}
                        />
                    </div>

                    <aside className="grid gap-4 sm:grid-cols-2 lg:sticky lg:top-20 lg:grid-cols-1">
                        <CaseSummaryCard
                            clientName={clientName}
                            originLabel={origin.subject ?? UNTITLED_INTAKE}
                            responsibleName={responsibleName}
                        />

                        <CaseFormActions
                            clientId={client.id}
                            formId={origin.id}
                            mode={mode}
                            isPending={isPending}
                            onSubmit={handleSubmit}
                        />

                        <div className="sm:col-span-2 lg:col-span-1">
                            <CaseRuleNotes />
                        </div>
                    </aside>
                </div>
            </FormProvider>

            <CaseMobileActions
                clientId={client.id}
                mode={mode}
                isPending={isPending}
                onSubmit={handleSubmit}
            />
        </div>
    );
};
