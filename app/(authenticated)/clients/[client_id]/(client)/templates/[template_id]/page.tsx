import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getOfficeProfile } from "@/app/(authenticated)/templates/upsert/queries/get-office-profile";
import { templateCategoryLabels } from "@/app/(authenticated)/templates/utils/template-labels";
import { Badge } from "@/components/ui/badge";

import { getClientContext } from "../../queries/get-client-context";
import { clientIdSchema } from "../../schemas/client-id-schema";
import {
  getUnresolvedClientVariables,
  resolveClientTemplateVariableValues,
  usesCaseVariables,
} from "../utils/resolve-client-template-variables";
import { ClientTemplatePreview } from "./feature/client-template-preview";
import { ClientTemplateReadinessAlert } from "./feature/client-template-readiness-alert";
import { getClientUsableTemplate } from "./queries/get-client-usable-template";
import { clientTemplateIdSchema } from "./schemas/client-template-id-schema";

type ClientTemplatePreviewPageProps = {
  params: Promise<{ client_id: string; template_id: string }>;
};

export const generateMetadata = async ({
  params,
}: ClientTemplatePreviewPageProps): Promise<Metadata> => {
  const { template_id: rawTemplateId } = await params;
  const parsedTemplateId = clientTemplateIdSchema.safeParse(rawTemplateId);

  if (!parsedTemplateId.success) {
    return { title: "Modelo" };
  }

  const template = await getClientUsableTemplate(parsedTemplateId.data);

  return { title: template?.name ?? "Modelo" };
};

const ClientTemplatePreviewPage = async ({
  params,
}: ClientTemplatePreviewPageProps) => {
  const { client_id: rawClientId, template_id: rawTemplateId } = await params;

  const parsedClientId = clientIdSchema.safeParse(rawClientId);
  const parsedTemplateId = clientTemplateIdSchema.safeParse(rawTemplateId);

  if (!parsedClientId.success || !parsedTemplateId.success) {
    notFound();
  }

  const [client, template, office] = await Promise.all([
    getClientContext(parsedClientId.data),
    getClientUsableTemplate(parsedTemplateId.data),
    getOfficeProfile(),
  ]);

  if (!client || !template) {
    notFound();
  }

  const missingVariables = getUnresolvedClientVariables(
    template.usedVariables,
    client,
  );
  const requiresCase = usesCaseVariables(template.usedVariables);
  const variableValues = resolveClientTemplateVariableValues(
    template.usedVariables,
    client,
    office,
  );

  return (
    <div className="grid gap-4">
      <header className="grid gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {templateCategoryLabels[template.category]}
          </Badge>

          {template.legalArea ? (
            <span className="font-mono text-xs text-muted-foreground uppercase">
              {template.legalArea}
            </span>
          ) : null}
        </div>

        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          {template.name}
        </h2>

        {template.description ? (
          <p className="text-sm text-muted-foreground">
            {template.description}
          </p>
        ) : null}
      </header>

      <ClientTemplateReadinessAlert
        clientId={client.id}
        missingVariables={missingVariables}
        requiresCase={requiresCase}
      />

      <ClientTemplatePreview
        office={office}
        page={template.page}
        signatures={template.signatures}
        contentHtml={template.contentHtml}
        variableValues={variableValues}
      />
    </div>
  );
};

export default ClientTemplatePreviewPage;
