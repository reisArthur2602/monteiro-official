"use client";

import { FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { DocumentPageSettings } from "./document-page-settings";
import { GeneralTemplateSettings } from "./general-template-settings";
import { TemplateSignatures } from "./template-signatures";

type TemplateSettingsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TemplateSettingsSheet = ({
  open,
  onOpenChange,
}: TemplateSettingsSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="right"
      // Tela inteira no mobile, painel lateral a partir de sm.
      className="w-full gap-0 overflow-y-auto sm:max-w-md"
    >
      <SheetHeader>
        <SheetTitle>Configurações do template</SheetTitle>

        <SheetDescription>
          Metadados da biblioteca, formato da folha e blocos de assinatura.
        </SheetDescription>
      </SheetHeader>

      <div className="grid gap-6 px-4 pb-8">
        <FieldSet>
          <FieldLegend variant="label">Geral</FieldLegend>
          <GeneralTemplateSettings />
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend variant="label">Documento</FieldLegend>
          <DocumentPageSettings />
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend variant="label">Assinaturas</FieldLegend>
          <TemplateSignatures />
        </FieldSet>
      </div>
    </SheetContent>
  </Sheet>
);
