import type { DocumentSignature } from "./document-types";

type DocumentSignaturesProps = {
  signatures: DocumentSignature[];
  /** Valores demonstrativos ou reais para assinaturas ligadas a variáveis. */
  variableValues?: Record<string, string>;
};

const resolveName = (
  signature: DocumentSignature,
  variableValues: Record<string, string>,
) => {
  if (signature.nameSource === "FIXED") {
    return signature.fixedName?.trim() || signature.label;
  }

  if (!signature.nameVariable) {
    return signature.label;
  }

  return (
    variableValues[signature.nameVariable] ?? `{{${signature.nameVariable}}}`
  );
};

export const DocumentSignatures = ({
  signatures,
  variableValues = {},
}: DocumentSignaturesProps) => {
  if (signatures.length === 0) {
    return null;
  }

  return (
    <section className="legal-document__signatures">
      {signatures.map((signature, index) => (
        <div
          // As assinaturas não têm id estável antes de publicar; a posição
          // é a identidade dentro do documento.
          key={signature.id ?? `${signature.label}-${index}`}
          className="legal-document__signature"
        >
          <strong>{resolveName(signature, variableValues)}</strong>

          <small>
            {[signature.label, signature.role].filter(Boolean).join(" · ")}
          </small>
        </div>
      ))}
    </section>
  );
};
