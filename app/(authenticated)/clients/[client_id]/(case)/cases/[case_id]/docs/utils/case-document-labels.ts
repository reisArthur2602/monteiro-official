import type { ClientDocumentCategory, ProcessDocumentRole } from '@/app/generated/prisma/enums';

/**
 * O repositório do processo não tem modelo de pasta: as "pastas" da árvore
 * são os valores de `ProcessDocumentRole`, que já classificam o papel do
 * documento dentro do processo. Por isso a estrutura é fixa e plana — não
 * há criação, renome ou aninhamento de pasta.
 */
export const processDocumentRoleFolderLabels: Record<ProcessDocumentRole, string> = {
    PETICAO: 'Petições',
    DECISAO: 'Decisões',
    SENTENCA: 'Sentenças',
    ACORDAO: 'Acórdãos',
    CONTRATO: 'Contratos',
    PROCURACAO: 'Procurações',
    COMPROVANTE: 'Comprovantes',
    PROVA: 'Provas e anexos',
    DOCUMENTO_CLIENTE: 'Documentos do cliente',
    DOCUMENTO_PARTE_CONTRARIA: 'Documentos da parte contrária',
    OUTRO: 'Outros documentos',
};

/** Mesma classificação no singular, para identificar um documento isolado. */
export const processDocumentRoleLabels: Record<ProcessDocumentRole, string> = {
    PETICAO: 'Petição',
    DECISAO: 'Decisão',
    SENTENCA: 'Sentença',
    ACORDAO: 'Acórdão',
    CONTRATO: 'Contrato',
    PROCURACAO: 'Procuração',
    COMPROVANTE: 'Comprovante',
    PROVA: 'Prova',
    DOCUMENTO_CLIENTE: 'Documento do cliente',
    DOCUMENTO_PARTE_CONTRARIA: 'Documento da parte contrária',
    OUTRO: 'Outro documento',
};

/**
 * Todo documento do processo é, antes disso, um documento do arquivo do
 * cliente — e `ClientDocument.category` é obrigatório. Em vez de pedir a
 * mesma informação duas vezes no formulário, a categoria do arquivo é
 * derivada da pasta escolhida.
 */
export const clientCategoryByDocumentRole: Record<ProcessDocumentRole, ClientDocumentCategory> = {
    PETICAO: 'DOCUMENTO_JURIDICO',
    DECISAO: 'DOCUMENTO_JURIDICO',
    SENTENCA: 'DOCUMENTO_JURIDICO',
    ACORDAO: 'DOCUMENTO_JURIDICO',
    CONTRATO: 'CONTRATO',
    PROCURACAO: 'PROCURACAO',
    COMPROVANTE: 'COMPROVANTE',
    PROVA: 'OUTRO',
    DOCUMENTO_CLIENTE: 'IDENTIFICACAO',
    DOCUMENTO_PARTE_CONTRARIA: 'OUTRO',
    OUTRO: 'OUTRO',
};
