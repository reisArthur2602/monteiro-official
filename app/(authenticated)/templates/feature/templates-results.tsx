import { listTemplates } from "../queries/list-templates";
import type { ListTemplatesParams } from "../schemas/list-templates-params-schema";
import { hasActiveTemplateFilters } from "../utils/build-templates-href";
import { TemplatesGrid } from "./templates-grid";
import { TemplatesPagination } from "./templates-pagination";

type TemplatesResultsProps = {
  params: ListTemplatesParams;
};

export const TemplatesResults = async ({ params }: TemplatesResultsProps) => {
  const { data, pagination } = await listTemplates(params);

  return (
    <div className="grid gap-6">
      <TemplatesGrid
        templates={data}
        hasFilters={hasActiveTemplateFilters(params)}
      />

      {pagination.pageCount > 1 ? (
        <TemplatesPagination
          params={params}
          page={pagination.page}
          pageCount={pagination.pageCount}
          total={pagination.total}
        />
      ) : null}
    </div>
  );
};
