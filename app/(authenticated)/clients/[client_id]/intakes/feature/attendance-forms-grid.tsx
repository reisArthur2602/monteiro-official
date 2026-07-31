import { listClientAttendanceForms } from "../queries/list-client-attendance-forms";
import type { ListAttendanceFormsParams } from "../schemas/list-attendance-forms-params-schema";
import { hasActiveIntakesFilters } from "../utils/build-intakes-href";
import { AttendanceFormCard } from "./attendance-form-card";
import { AttendanceFormsEmpty } from "./attendance-forms-empty";
import { AttendanceFormsPagination } from "./attendance-forms-pagination";

type AttendanceFormsGridProps = {
  clientId: string;
  params: ListAttendanceFormsParams;
};

export const AttendanceFormsGrid = async ({
  clientId,
  params,
}: AttendanceFormsGridProps) => {
  const { data, pagination } = await listClientAttendanceForms(
    clientId,
    params,
  );

  if (data.length === 0) {
    return (
      <AttendanceFormsEmpty
        clientId={clientId}
        hasFilters={hasActiveIntakesFilters(params)}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((form, index) => (
          <AttendanceFormCard
            key={form.id}
            clientId={clientId}
            form={form}
            index={index}
          />
        ))}
      </div>

      {pagination.pageCount > 1 ? (
        <AttendanceFormsPagination
          clientId={clientId}
          params={params}
          page={pagination.page}
          pageCount={pagination.pageCount}
          total={pagination.total}
          from={pagination.from}
          to={pagination.to}
        />
      ) : null}
    </div>
  );
};
