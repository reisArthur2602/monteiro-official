import type { ClientContext } from "../../queries/get-client-context";
import type { ClientUsableTemplate } from "../queries/list-client-usable-templates";
import { ClientTemplateRow } from "./client-template-row";
import { ClientTemplatesEmpty } from "./client-templates-empty";

type ClientTemplatesListProps = {
  clientId: string;
  client: ClientContext;
  templates: ClientUsableTemplate[];
  hasFilters: boolean;
};

export const ClientTemplatesList = ({
  clientId,
  client,
  templates,
  hasFilters,
}: ClientTemplatesListProps) => {
  if (templates.length === 0) {
    return <ClientTemplatesEmpty clientId={clientId} hasFilters={hasFilters} />;
  }

  return (
    <div className="grid gap-2.5">
      {templates.map((template) => (
        <ClientTemplateRow
          key={template.id}
          clientId={clientId}
          client={client}
          template={template}
        />
      ))}
    </div>
  );
};
