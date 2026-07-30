import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { redirectAuth } from "@/utils/auth";

import { TemplateFormProvider } from "./feature/template-form-provider";
import { TemplateUpsertScreen } from "./feature/template-upsert-screen";
import { createEmptyTemplateFormValues } from "./mappers/template-form-mapper";
import { getOfficeProfile } from "./queries/get-office-profile";
import { getTemplateForEdit } from "./queries/get-template-for-edit";
import { templateQuerySchema } from "./schemas/template-query-schema";

export const metadata: Metadata = {
  title: "Editor de template",
};

type TemplateUpsertPageProps = {
  searchParams: Promise<{
    templateId?: string;
  }>;
};

const TemplateUpsertPage = async ({
  searchParams,
}: TemplateUpsertPageProps) => {
  await redirectAuth();

  const parsedQuery = templateQuerySchema.safeParse(await searchParams);

  // Um `templateId` malformado não chega ao banco: a rota simplesmente
  // não existe para aquele endereço.
  if (!parsedQuery.success) {
    notFound();
  }

  const { templateId } = parsedQuery.data;
  const office = await getOfficeProfile();

  if (!templateId) {
    return (
      <TemplateFormProvider
        mode="create"
        initialValues={createEmptyTemplateFormValues()}
        initialRevision={1}
        initialVersion={0}
        initialStatus="RASCUNHO"
        office={office}
      >
        <TemplateUpsertScreen />
      </TemplateFormProvider>
    );
  }

  const template = await getTemplateForEdit(templateId);

  if (!template) {
    notFound();
  }

  return (
    <TemplateFormProvider
      mode="edit"
      templateId={template.meta.templateId}
      initialValues={template.values}
      initialRevision={template.meta.revision}
      initialVersion={template.meta.currentVersion}
      initialStatus={template.meta.status}
      office={office}
    >
      <TemplateUpsertScreen />
    </TemplateFormProvider>
  );
};

export default TemplateUpsertPage;
