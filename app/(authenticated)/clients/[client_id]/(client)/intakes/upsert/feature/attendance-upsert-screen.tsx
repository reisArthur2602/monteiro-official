'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { AttendanceFormStatus } from '@/app/generated/prisma/enums';
import { Button } from '@/components/ui/button';

import type { ClientContext } from '../../../queries/get-client-context';
import { buildIntakesHref, buildIntakeUpsertHref } from '../../utils/build-intakes-href';
import { createAttendanceForm } from '../actions/create-attendance-form';
import { deleteAttendanceForm } from '../actions/delete-attendance-form';
import { updateAttendanceForm } from '../actions/update-attendance-form';
import {
    type AttendanceFormValues,
    attendanceFormFinalizeSchema,
} from '../schemas/attendance-form-schema';
import { AttendanceActionsPanel } from './attendance-actions-panel';
import { AttendanceDeleteMenu } from './attendance-delete-menu';
import { AttendanceInfoPanel } from './attendance-info-panel';
import { AttendanceMobileActions } from './attendance-mobile-actions';
import { AttendanceSummaryCard } from './attendance-summary-card';
import { AttendanceSystemPanel } from './attendance-system-panel';
import { ClientReportPanel } from './client-report-panel';
import { ClientSnapshotPanel } from './client-snapshot-panel';
import { PreliminaryAnalysisPanel } from './preliminary-analysis-panel';

type AttendanceUpsertScreenProps = {
    client: ClientContext;
    formId?: string;
    initialValues: AttendanceFormValues;
    initialStatus: AttendanceFormStatus;
    attendanceAt: Date;
    responsibleName: string;
};

export const AttendanceUpsertScreen = ({
    client,
    formId: initialFormId,
    initialValues,
    initialStatus,
    attendanceAt,
    responsibleName,
}: AttendanceUpsertScreenProps) => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [savedFormId, setSavedFormId] = useState(initialFormId);

    // Não muda depois de finalizar: a tela navega para a listagem em
    // seguida, então não há necessidade de refletir o novo status aqui.
    const status = initialStatus;

    const form = useForm<AttendanceFormValues>({
        defaultValues: initialValues,
        mode: 'onBlur',
    });

    const clientName = client.displayName ?? client.name;
    const mode = savedFormId ? 'edit' : 'create';

    const applyFieldErrors = (errors?: Record<string, string[] | undefined>) => {
        for (const [field, messages] of Object.entries(errors ?? {})) {
            const message = messages?.[0];

            if (message) {
                form.setError(field as keyof AttendanceFormValues, { message });
            }
        }
    };

    const handleSaveDraft = async () => {
        setIsPending(true);

        try {
            const values = form.getValues();

            const result = savedFormId
                ? await updateAttendanceForm({
                      clientId: client.id,
                      formId: savedFormId,
                      values,
                      finalize: false,
                  })
                : await createAttendanceForm({
                      clientId: client.id,
                      values,
                      finalize: false,
                  });

            if (!result.ok) {
                applyFieldErrors(result.errors);
                toast.error(result.message);
                return;
            }

            toast.success(result.message);

            // A primeira vez que salva um rascunho novo, o registro passa a
            // existir: daqui em diante os cliques salvam nele, não duplicam.
            if (!savedFormId && result.data) {
                setSavedFormId(result.data.formId);
                router.replace(buildIntakeUpsertHref(client.id, result.data.formId), {
                    scroll: false,
                });
            }
        } catch {
            toast.error('Não foi possível concluir a operação');
        } finally {
            setIsPending(false);
        }
    };

    const handleFinalize = async () => {
        const values = form.getValues();
        const finalizeCheck = attendanceFormFinalizeSchema.safeParse(values);

        if (!finalizeCheck.success) {
            applyFieldErrors(finalizeCheck.error.flatten().fieldErrors);
            toast.error('Revise os campos obrigatórios para finalizar');
            return;
        }

        setIsPending(true);

        try {
            const result = savedFormId
                ? await updateAttendanceForm({
                      clientId: client.id,
                      formId: savedFormId,
                      values,
                      finalize: true,
                  })
                : await createAttendanceForm({
                      clientId: client.id,
                      values,
                      finalize: true,
                  });

            if (!result.ok) {
                applyFieldErrors(result.errors);
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            router.push(buildIntakesHref(client.id, {}));
        } catch {
            toast.error('Não foi possível concluir a operação');
        } finally {
            setIsPending(false);
        }
    };

    const handleDelete = async () => {
        if (!savedFormId) {
            return;
        }

        setIsPending(true);

        try {
            const result = await deleteAttendanceForm({
                clientId: client.id,
                formId: savedFormId,
            });

            if (!result.ok) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            router.push(buildIntakesHref(client.id, {}));
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
                        Ficha de atendimento
                    </span>

                    <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                        {mode === 'edit'
                            ? 'Editar ficha de atendimento'
                            : 'Nova ficha de atendimento'}
                    </h1>

                    <p className="text-muted-foreground">
                        Registre o relato, a análise preliminar e os encaminhamentos definidos para
                        o cliente.
                    </p>
                </div>

                <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
                    <Button asChild variant="outline">
                        <Link href={buildIntakesHref(client.id, {})}>Cancelar</Link>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={handleSaveDraft}
                    >
                        Salvar rascunho
                    </Button>

                    <Button type="button" disabled={isPending} onClick={handleFinalize}>
                        {isPending ? 'Salvando…' : 'Finalizar ficha'}
                    </Button>

                    {mode === 'edit' ? (
                        <AttendanceDeleteMenu isPending={isPending} onDelete={handleDelete} />
                    ) : null}
                </div>
            </header>

            <FormProvider {...form}>
                <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="grid gap-4">
                        <ClientSnapshotPanel client={client} />

                        <AttendanceSystemPanel
                            attendanceAt={attendanceAt}
                            responsibleName={responsibleName}
                        />

                        <AttendanceInfoPanel />
                        <ClientReportPanel />
                        <PreliminaryAnalysisPanel />
                        <AttendanceActionsPanel />
                    </div>

                    <aside className="grid gap-4 lg:sticky lg:top-20">
                        <AttendanceSummaryCard
                            clientName={clientName}
                            responsibleName={responsibleName}
                            status={status}
                        />
                    </aside>
                </div>
            </FormProvider>

            <AttendanceMobileActions
                clientId={client.id}
                mode={mode}
                isPending={isPending}
                onSaveDraft={handleSaveDraft}
                onFinalize={handleFinalize}
                onDelete={handleDelete}
            />
        </div>
    );
};
