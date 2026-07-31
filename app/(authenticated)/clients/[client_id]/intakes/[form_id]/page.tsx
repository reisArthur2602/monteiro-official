import { SquarePen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getOfficeProfile } from "@/app/(authenticated)/templates/upsert/queries/get-office-profile";
import { Button } from "@/components/ui/button";

import { getClientContext } from "../../queries/get-client-context";
import { clientIdSchema } from "../../schemas/client-id-schema";
import { attendanceFormStatusLabels } from "../../utils/attendance-form-labels";
import { buildIntakeUpsertHref } from "../utils/build-intakes-href";
import { AttendanceDetailActionsPanel } from "./feature/attendance-detail-actions-panel";
import { AttendanceDetailMobileActions } from "./feature/attendance-detail-mobile-actions";
import { AttendanceDocumentPreview } from "./feature/attendance-document-preview";
import { AttendanceInfoSummaryPanel } from "./feature/attendance-info-summary-panel";
import { PrintButton } from "./feature/print-button";
import { getAttendanceFormDetail } from "./queries/get-attendance-form-detail";
import { formIdSchema } from "./schemas/form-id-schema";
import { formatDateTime } from "./utils/format-datetime";

type AttendanceFormDetailPageProps = {
  params: Promise<{ client_id: string; form_id: string }>;
};

export const generateMetadata = async ({
  params,
}: AttendanceFormDetailPageProps): Promise<Metadata> => {
  const { client_id: rawClientId, form_id: rawFormId } = await params;

  const parsedClientId = clientIdSchema.safeParse(rawClientId);
  const parsedFormId = formIdSchema.safeParse(rawFormId);

  if (!parsedClientId.success || !parsedFormId.success) {
    return { title: "Ficha de atendimento" };
  }

  const form = await getAttendanceFormDetail(
    parsedClientId.data,
    parsedFormId.data,
  );

  return { title: form?.subject || "Ficha de atendimento" };
};

const AttendanceFormDetailPage = async ({
  params,
}: AttendanceFormDetailPageProps) => {
  const { client_id: rawClientId, form_id: rawFormId } = await params;

  const parsedClientId = clientIdSchema.safeParse(rawClientId);
  const parsedFormId = formIdSchema.safeParse(rawFormId);

  if (!parsedClientId.success || !parsedFormId.success) {
    notFound();
  }

  const clientId = parsedClientId.data;
  const formId = parsedFormId.data;

  const [client, form, office] = await Promise.all([
    getClientContext(clientId),
    getAttendanceFormDetail(clientId, formId),
    getOfficeProfile(),
  ]);

  if (!client || !form) {
    notFound();
  }

  const subject = form.subject || "Ficha sem assunto";
  const statusLabel = attendanceFormStatusLabels[form.status];

  return (
    <div className="grid gap-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
            Ficha {statusLabel.toLowerCase()}
          </span>

          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {subject}
          </h2>

          <p className="text-sm text-muted-foreground">
            Criada em {formatDateTime(form.createdAt)} por {form.createdBy.name}
            .
          </p>
        </div>

        <div className="hidden flex-wrap gap-2 sm:flex">
          <PrintButton />

          <Button asChild>
            <Link href={buildIntakeUpsertHref(clientId, formId)}>
              <SquarePen aria-hidden="true" />
              Editar ficha
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="grid gap-4 lg:sticky lg:top-20">
          <AttendanceInfoSummaryPanel form={form} statusLabel={statusLabel} />

          <AttendanceDetailActionsPanel
            clientId={clientId}
            formId={formId}
            status={form.status}
            caseId={form.process?.id ?? null}
          />
        </aside>

        <AttendanceDocumentPreview
          office={office}
          client={client}
          form={form}
        />
      </div>

      <AttendanceDetailMobileActions clientId={clientId} formId={formId} />
    </div>
  );
};

export default AttendanceFormDetailPage;
