import type {
  AttendanceChannel,
  ClientAttendanceActionType,
} from "@/app/generated/prisma/enums";

import type { AttendanceFormValues } from "../schemas/attendance-form-schema";

export const createEmptyAttendanceFormValues = (): AttendanceFormValues => ({
  channel: "",
  contactPerson: "",
  legalArea: "",
  subject: "",
  clientReport: "",
  preliminaryAnalysis: "",
  actions: [],
});

type AttendanceFormRecord = {
  channel: AttendanceChannel | null;
  contactPerson: string | null;
  legalArea: string | null;
  subject: string | null;
  clientReport: string | null;
  preliminaryAnalysis: string | null;
  actions: { type: ClientAttendanceActionType }[];
};

export const mapAttendanceFormToValues = (
  form: AttendanceFormRecord,
): AttendanceFormValues => ({
  channel: form.channel ?? "",
  contactPerson: form.contactPerson ?? "",
  legalArea: form.legalArea ?? "",
  subject: form.subject ?? "",
  clientReport: form.clientReport ?? "",
  preliminaryAnalysis: form.preliminaryAnalysis ?? "",
  actions: form.actions.map((action) => action.type),
});
