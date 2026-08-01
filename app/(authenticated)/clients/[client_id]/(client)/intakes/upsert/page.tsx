import { AttendanceFormStatus } from '@/app/generated/prisma/enums';
import { redirectAuth } from '@/utils/auth';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClientContext } from '../../queries/get-client-context';
import { clientIdSchema } from '../../schemas/client-id-schema';
import { AttendanceUpsertScreen } from './feature/attendance-upsert-screen';
import { createEmptyAttendanceFormValues } from './mappers/attendance-form-mapper';
import { getAttendanceFormForEdit } from './queries/get-attendance-form-for-edit';
import { attendanceFormQuerySchema } from './schemas/attendance-form-query-schema';

export const metadata: Metadata = {
    title: 'Ficha de atendimento',
};

type UpsertIntakePageProps = {
    params: Promise<{ client_id: string }>;
    searchParams: Promise<{ formId?: string }>;
};

const UpsertIntakePage = async ({ params, searchParams }: UpsertIntakePageProps) => {
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

    const parsedQuery = attendanceFormQuerySchema.safeParse(await searchParams);

    if (!parsedQuery.success) {
        notFound();
    }

    const { formId } = parsedQuery.data;

    if (!formId) {
        return (
            <AttendanceUpsertScreen
                client={client}
                initialValues={createEmptyAttendanceFormValues()}
                initialStatus={AttendanceFormStatus.RASCUNHO}
                attendanceAt={new Date()}
                responsibleName={user.name}
            />
        );
    }

    const form = await getAttendanceFormForEdit(clientId, formId);

    if (!form) {
        notFound();
    }

    return (
        <AttendanceUpsertScreen
            client={client}
            formId={form.formId}
            initialValues={form.values}
            initialStatus={form.status}
            attendanceAt={new Date(form.attendanceAt)}
            responsibleName={form.responsibleName}
        />
    );
};

export default UpsertIntakePage;
