"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { TemplateStatus } from "@/app/generated/prisma/enums";
import type { OfficeProfile } from "@/components/shared/documents/document-types";

import { publishTemplateVersion } from "../actions/publish-template-version";
import { useTemplateSave } from "../hooks/use-template-save";
import { templateFormSchema } from "../schemas/template-form-schema";
import type {
  SaveState,
  TemplateFormValues,
  TemplateUpsertMode,
} from "../types/template-types";

export const TEMPLATE_FORM_ID = "template-upsert-form";

type TemplateUpsertContextValue = {
  mode: TemplateUpsertMode;
  templateId: string | null;
  currentVersion: number;
  status: TemplateStatus;
  office: OfficeProfile;
  isPublishing: boolean;
  isDirty: boolean;
  saveState: SaveState;
  saveMessage: string;
  /** Grava o rascunho pendente sob demanda — nunca dispara sozinho. */
  save: () => Promise<boolean>;
};

const TemplateUpsertContext = createContext<TemplateUpsertContextValue | null>(
  null,
);

export const useTemplateUpsert = () => {
  const context = useContext(TemplateUpsertContext);

  if (!context) {
    throw new Error(
      "useTemplateUpsert precisa estar dentro de TemplateFormProvider",
    );
  }

  return context;
};

type TemplateFormProviderProps = PropsWithChildren<{
  mode: TemplateUpsertMode;
  templateId?: string;
  initialValues: TemplateFormValues;
  initialRevision: number;
  initialVersion: number;
  initialStatus: TemplateStatus;
  office: OfficeProfile;
}>;

/**
 * Única instância de `useForm` da tela.
 *
 * Fora do formulário ficam, de propósito, os dados que não são editáveis
 * pelo usuário: identidade do template, revisão do rascunho, versão
 * publicada e status. Eles são estado do servidor, não campos.
 */
export const TemplateFormProvider = ({
  mode,
  templateId: initialTemplateId,
  initialValues,
  initialRevision,
  initialVersion,
  initialStatus,
  office,
  children,
}: TemplateFormProviderProps) => {
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: initialValues,
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const [templateId, setTemplateId] = useState(initialTemplateId ?? null);
  const [revision, setRevision] = useState(initialRevision);
  const [currentVersion, setCurrentVersion] = useState(initialVersion);
  const [status, setStatus] = useState<TemplateStatus>(initialStatus);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleTemplateCreated = (
    createdId: string,
    createdRevision: number,
  ) => {
    setTemplateId(createdId);
    setRevision(createdRevision);
  };

  const {
    isDirty,
    saveState,
    saveMessage,
    save,
    getRevision,
    getTemplateId,
  } = useTemplateSave({
    form,
    templateId,
    revision,
    onTemplateCreated: handleTemplateCreated,
    onRevisionChanged: setRevision,
  });

  const handlePublish = async (values: TemplateFormValues) => {
    setIsPublishing(true);

    try {
      // Garante que o rascunho pendente esteja gravado — e, no modo de
      // criação, que o template exista — antes de versionar. Publicar sem
      // isso não é uma ação destrutiva a confirmar: é sempre "salvar a
      // mais", então acontece direto, sem diálogo extra.
      const saved = await save();

      if (!saved) {
        toast.error(
          "Não foi possível salvar o rascunho antes de publicar. Tente novamente.",
        );
        return;
      }

      // Lido das refs do hook, não do fechamento: se `save()` acabou de
      // criar o template ou gravar uma revisão nova, o `templateId`/
      // `revision` deste componente só reflete isso no próximo render.
      const targetId = values.id ?? getTemplateId() ?? templateId;

      if (!targetId) {
        toast.error("O rascunho ainda não foi criado. Tente novamente.");
        return;
      }

      const result = await publishTemplateVersion({
        templateId: targetId,
        revision: getRevision(),
        values,
      });

      if (!result.ok || !result.data) {
        toast.error(result.message);
        return;
      }

      setCurrentVersion(result.data.version);
      setRevision(result.data.revision);
      setStatus("ATIVO");
      toast.success(result.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const contextValue: TemplateUpsertContextValue = {
    mode,
    templateId,
    currentVersion,
    status,
    office,
    isPublishing,
    isDirty,
    saveState,
    saveMessage,
    save,
  };

  return (
    <TemplateUpsertContext.Provider value={contextValue}>
      <FormProvider {...form}>
        <form
          id={TEMPLATE_FORM_ID}
          onSubmit={form.handleSubmit(handlePublish)}
          className="contents"
          noValidate
        >
          {children}
        </form>
      </FormProvider>
    </TemplateUpsertContext.Provider>
  );
};
