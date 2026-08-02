import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { generateHTML } from "@tiptap/html/server";
import { hash } from "bcryptjs";

import { legalEditorExtensions } from "../app/(authenticated)/templates/upsert/editor/legal-editor-extensions";
import { defaultPageSettings } from "../app/(authenticated)/templates/upsert/mappers/template-form-mapper";
import { PrismaClient } from "../app/generated/prisma/client";
import {
  AttendanceChannel,
  AttendanceFormStatus,
  ClientAttendanceActionType,
  ClientStatus,
  ClientType,
  TemplateCategory,
  TemplateStatus,
  UserRole,
} from "../app/generated/prisma/enums";

/** Documento TipTap mínimo: um parágrafo por string, sem marcas nem variáveis. */
const buildSeedDocument = (paragraphs: string[]) => ({
  type: "doc",
  content: paragraphs.map((text) => ({
    type: "paragraph",
    content: [{ type: "text", text }],
  })),
});

const DEFAULT_PASSWORD = "monteiro123";
const SALT_ROUNDS = 10;

const seedUsers = [
  {
    name: "Ana Monteiro",
    email: "ana.monteiro@monteiro.adv.br",
    role: UserRole.ADMINISTRADOR,
  },
  {
    name: "Rafael Costa",
    email: "rafael.costa@monteiro.adv.br",
    role: UserRole.ADVOGADO,
  },
  {
    name: "Lucas Martins",
    email: "lucas.martins@monteiro.adv.br",
    role: UserRole.COLABORADOR,
  },
];

const resolvePassword = () => {
  const password = process.env.SEED_PASSWORD;

  if (password) {
    if (password.length < 8) {
      throw new Error("SEED_PASSWORD deve ter pelo menos 8 caracteres");
    }

    return password;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Defina SEED_PASSWORD para executar o seed fora do ambiente de desenvolvimento",
    );
  }

  return DEFAULT_PASSWORD;
};

const seedTemplates = [
  {
    name: "Contrato de Honorários",
    description:
      "Modelo padrão para acordo de honorários entre escritório e cliente",
    category: TemplateCategory.CONTRATO,
    legalArea: "Geral",
    status: TemplateStatus.ATIVO,
    content: [
      "As partes abaixo identificadas ajustam o presente contrato de prestação de serviços advocatícios, regido pelas cláusulas a seguir.",
      "O escritório contratado se compromete a patrocinar os interesses do contratante nos termos do mandato outorgado, mediante o pagamento dos honorários ora pactuados.",
    ],
  },
  {
    name: "Petição Inicial (Cível)",
    description:
      "Estrutura para ação cível com campos variáveis para partes e causa de pedir",
    category: TemplateCategory.PETICAO,
    legalArea: "Cível",
    status: TemplateStatus.ATIVO,
    content: [
      "Excelentíssimo Senhor Doutor Juiz de Direito da Vara Cível, o autor, por meio de seu advogado que esta subscreve, vem respeitosamente à presença de Vossa Excelência propor a presente ação, pelos fatos e fundamentos a seguir expostos.",
      "Requer-se a citação da parte ré para, querendo, apresentar defesa no prazo legal, sob pena de revelia, e, ao final, a procedência dos pedidos formulados.",
    ],
  },
  {
    name: "Procuração Judicial",
    description: "Documento de procuração para representação em juízo",
    category: TemplateCategory.PROCURACAO,
    legalArea: "Geral",
    status: TemplateStatus.ATIVO,
    content: [
      "Pelo presente instrumento particular de mandato, o outorgante nomeia e constitui seu bastante procurador o advogado abaixo identificado, a quem confere amplos poderes para o foro em geral.",
      "O mandato inclui poderes para propor e contestar ações, substabelecer com ou sem reserva de poderes, e praticar todos os atos necessários à defesa dos interesses do outorgante em juízo ou fora dele.",
    ],
  },
  {
    name: "Notificação de Inadimplência",
    description:
      "Comunicação formal de falta de pagamento com prazo para regularização",
    category: TemplateCategory.NOTIFICACAO,
    legalArea: "Trabalhista",
    status: TemplateStatus.ATIVO,
    content: [
      "Vimos, por meio desta, notificar Vossa Senhoria acerca do inadimplemento da obrigação pactuada, concedendo-lhe o prazo de 5 (cinco) dias úteis para a devida regularização.",
      "Decorrido o prazo sem a devida quitação, adotaremos as medidas judiciais cabíveis para a satisfação do crédito, sem prejuízo dos encargos moratórios já incidentes.",
    ],
  },
  {
    name: "Parecer Jurídico",
    description: "Análise de situação jurídica específica com recomendações",
    category: TemplateCategory.OUTRO,
    legalArea: "Geral",
    status: TemplateStatus.RASCUNHO,
    content: [
      "Trata-se de consulta acerca da situação jurídica descrita, para a qual apresentamos a análise e as considerações a seguir.",
      "Diante do exposto, opinamos pela viabilidade da medida pretendida, observadas as ressalvas e recomendações constantes deste parecer.",
    ],
  },
];

type SeedClient = {
  name: string;
  displayName?: string;
  document: string;
  type: ClientType;
  status: ClientStatus;
  email: string;
  phone?: string | null;
  birthDate?: Date;
  stateRegistration?: string;
  municipalRegistration?: string;
  notes?: string;
  responsibleEmail: string;
  address?: {
    postalCode: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
  } | null;
};

/**
 * `document`, `phone` e `postalCode` são gravados com dígitos apenas — a
 * máscara é responsabilidade da exibição. `responsibleEmail` amarra o
 * cliente a um dos usuários semeados acima.
 *
 * A amostra cobre de propósito os casos que a tela precisa tratar: pessoa
 * jurídica com e sem nome fantasia, pessoa física com e sem nome social,
 * cliente sem endereço e cliente sem telefone.
 *
 * Todos os CPF/CNPJ passam pelos dígitos verificadores — o formulário os
 * valida de verdade, então documentos decorativos travariam a edição.
 */
const seedClients: SeedClient[] = [
  {
    name: "Monteiro Comércio Ltda.",
    displayName: "Monteiro Store",
    document: "12345678000195",
    type: ClientType.PESSOA_JURIDICA,
    status: ClientStatus.ATIVO,
    email: "juridico@monteirocomercio.com.br",
    phone: "11988881212",
    stateRegistration: "110.042.490.114",
    municipalRegistration: "1.234.567-8",
    notes: "Contrato de assessoria mensal renovado em janeiro.",
    responsibleEmail: "ana.monteiro@monteiro.adv.br",
    address: {
      postalCode: "01310100",
      street: "Avenida Paulista",
      number: "1000",
      complement: "conjunto 142",
      district: "Bela Vista",
      city: "São Paulo",
      state: "SP",
    },
  },
  {
    name: "Luciana Prado de Almeida",
    displayName: "Luciana Prado",
    document: "12345678909",
    type: ClientType.PESSOA_FISICA,
    status: ClientStatus.ATIVO,
    email: "luciana.prado@email.com",
    phone: "11977773030",
    birthDate: new Date("1986-04-17T00:00:00.000Z"),
    responsibleEmail: "rafael.costa@monteiro.adv.br",
    address: {
      postalCode: "05422030",
      street: "Rua das Acácias",
      number: "128",
      district: "Pinheiros",
      city: "São Paulo",
      state: "SP",
    },
  },
  {
    name: "Grupo Arco S.A.",
    document: "45123987000170",
    type: ClientType.PESSOA_JURIDICA,
    status: ClientStatus.ATIVO,
    email: "contato@grupoarco.com.br",
    phone: "1140028922",
    stateRegistration: "336.118.207.905",
    responsibleEmail: "lucas.martins@monteiro.adv.br",
    address: {
      postalCode: "20031170",
      street: "Avenida Rio Branco",
      number: "277",
      complement: "10º andar",
      district: "Centro",
      city: "Rio de Janeiro",
      state: "RJ",
    },
  },
  {
    name: "Carlos Henrique Lima",
    document: "98765432100",
    type: ClientType.PESSOA_FISICA,
    status: ClientStatus.PROSPECTO,
    email: "carlos.lima@email.com",
    phone: "11966661414",
    notes: "Indicado por Luciana Prado. Aguarda proposta de honorários.",
    responsibleEmail: "ana.monteiro@monteiro.adv.br",
    // Prospecto ainda sem endereço cadastrado.
    address: null,
  },
  {
    name: "Horizonte Tecnologia Ltda.",
    displayName: "Horizonte Tech",
    document: "28456333000149",
    type: ClientType.PESSOA_JURIDICA,
    status: ClientStatus.ATIVO,
    email: "legal@horizontetecnologia.com",
    phone: "11955559090",
    municipalRegistration: "9.876.543-2",
    responsibleEmail: "rafael.costa@monteiro.adv.br",
    address: {
      postalCode: "30130010",
      street: "Avenida Afonso Pena",
      number: "1500",
      district: "Centro",
      city: "Belo Horizonte",
      state: "MG",
    },
  },
  {
    name: "Beatriz Almeida Rocha",
    document: "32165498791",
    type: ClientType.PESSOA_FISICA,
    status: ClientStatus.INATIVO,
    email: "beatriz.rocha@email.com",
    // Cliente inativa sem telefone, para exercitar o estado ausente.
    phone: null,
    birthDate: new Date("1979-11-02T00:00:00.000Z"),
    responsibleEmail: "lucas.martins@monteiro.adv.br",
    address: {
      postalCode: "80020320",
      street: "Rua Marechal Deodoro",
      number: "630",
      district: "Centro",
      city: "Curitiba",
      state: "PR",
    },
  },
];

type SeedAttendanceForm = {
  clientDocument: string;
  responsibleEmail: string;
  createdByEmail: string;
  updatedByEmail: string;
  finalizedByEmail?: string;
  status: AttendanceFormStatus;
  channel?: AttendanceChannel;
  contactPerson?: string;
  subject: string;
  legalArea?: string;
  clientReport?: string;
  preliminaryAnalysis?: string;
  daysAgo: number;
  actions: ClientAttendanceActionType[];
};

/**
 * `clientDocument` amarra a ficha a um cliente semeado acima. Como o
 * modelo não tem chave natural, a idempotência do upsert usa o par
 * (clientId, subject) — único dentro desta massa de dados controlada.
 *
 * `daysAgo` só existe aqui: em produção `attendanceAt` é sempre definido
 * pelo servidor no momento da criação, nunca recebido de fora.
 */
const seedAttendanceForms: SeedAttendanceForm[] = [
  {
    clientDocument: "12345678000195",
    responsibleEmail: "ana.monteiro@monteiro.adv.br",
    createdByEmail: "ana.monteiro@monteiro.adv.br",
    updatedByEmail: "ana.monteiro@monteiro.adv.br",
    finalizedByEmail: "ana.monteiro@monteiro.adv.br",
    status: AttendanceFormStatus.FINALIZADA,
    channel: AttendanceChannel.PRESENCIAL,
    contactPerson: "Carla Nunes (Financeiro)",
    subject: "Revisão de contrato de prestação de serviços",
    legalArea: "Empresarial",
    clientReport:
      "Cliente solicitou revisão das cláusulas de reajuste e multa rescisória do contrato vigente com fornecedor.",
    preliminaryAnalysis:
      "Cláusula de reajuste sem índice definido. Recomendada renegociação antes da renovação em 90 dias.",
    daysAgo: 12,
    actions: [
      ClientAttendanceActionType.ANALISAR_DOCUMENTOS,
      ClientAttendanceActionType.ELABORAR_CONTRATO_OU_ADITIVO,
    ],
  },
  {
    clientDocument: "12345678909",
    responsibleEmail: "rafael.costa@monteiro.adv.br",
    createdByEmail: "rafael.costa@monteiro.adv.br",
    updatedByEmail: "rafael.costa@monteiro.adv.br",
    status: AttendanceFormStatus.RASCUNHO,
    channel: AttendanceChannel.VIDEOCHAMADA,
    subject: "Consulta sobre partilha de bens",
    legalArea: "Família",
    clientReport:
      "Cliente relata processo de separação consensual e dúvidas sobre partilha de imóvel adquirido antes do casamento.",
    daysAgo: 2,
    actions: [
      ClientAttendanceActionType.SOLICITAR_INFORMACOES_COMPLEMENTARES,
      ClientAttendanceActionType.AGENDAR_RETORNO,
    ],
  },
  {
    clientDocument: "98765432100",
    responsibleEmail: "ana.monteiro@monteiro.adv.br",
    createdByEmail: "ana.monteiro@monteiro.adv.br",
    updatedByEmail: "ana.monteiro@monteiro.adv.br",
    status: AttendanceFormStatus.RASCUNHO,
    channel: AttendanceChannel.TELEFONE,
    subject: "Primeira consulta - possível ação trabalhista",
    legalArea: "Trabalhista",
    clientReport:
      "Cliente relata demissão sem justa causa com verbas rescisórias pendentes há mais de 60 dias.",
    preliminaryAnalysis:
      "Caso com bom potencial. Aguardando documentos para confirmar viabilidade antes da proposta de honorários.",
    daysAgo: 5,
    actions: [
      ClientAttendanceActionType.SOLICITAR_DOCUMENTOS,
      ClientAttendanceActionType.CONSULTAR_PROCESSO_EXISTENTE,
      ClientAttendanceActionType.ENVIAR_PROPOSTA_HONORARIOS,
    ],
  },
  {
    clientDocument: "45123987000170",
    responsibleEmail: "lucas.martins@monteiro.adv.br",
    createdByEmail: "lucas.martins@monteiro.adv.br",
    updatedByEmail: "lucas.martins@monteiro.adv.br",
    status: AttendanceFormStatus.CANCELADA,
    channel: AttendanceChannel.EMAIL,
    subject: "Due diligence societária preliminar",
    legalArea: "Empresarial",
    clientReport:
      "Cliente avaliava aquisição de participação societária em concorrente, mas desistiu da operação.",
    daysAgo: 20,
    actions: [ClientAttendanceActionType.ENCERRAR_SEM_PROVIDENCIAS],
  },
];

const main = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL não configurada");
  }

  const password = resolvePassword();
  const passwordHash = await hash(password, SALT_ROUNDS);

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    // Create users
    for (const user of seedUsers) {
      await prisma.user.upsert({
        where: {
          email: user.email,
        },
        create: {
          ...user,
          passwordHash,
        },
        update: {
          name: user.name,
          role: user.role,
          passwordHash,
          deletedAt: null,
        },
      });

      console.log(`✓ ${user.email} (${user.role})`);
    }

    console.log();

    // Get admin user for templates
    const adminUser = await prisma.user.findUniqueOrThrow({
      where: { email: "ana.monteiro@monteiro.adv.br" },
    });

    // Create templates
    for (const template of seedTemplates) {
      const existing = await prisma.template.findFirst({
        where: { name: template.name },
      });

      // A revisão publicada (`currentVersion`) só existe quando o próprio
      // template nasce ATIVO no seed — sem isto, um template "publicado"
      // ficaria com `currentVersion: 0`, um estado que o fluxo real de
      // publicação nunca produz.
      const currentVersion = template.status === TemplateStatus.ATIVO ? 1 : 0;

      const templateId = existing
        ? existing.id
        : (
            await prisma.template.create({
              data: {
                name: template.name,
                description: template.description,
                category: template.category,
                legalArea: template.legalArea,
                status: template.status,
                currentVersion,
                createdById: adminUser.id,
                updatedById: adminUser.id,
              },
              select: { id: true },
            })
          ).id;

      if (existing) {
        await prisma.template.update({
          where: { id: existing.id },
          data: {
            description: template.description,
            category: template.category,
            legalArea: template.legalArea,
            status: template.status,
            currentVersion,
            deletedAt: null,
          },
        });
      }

      // O rascunho/versão só é gravado se ainda não existir: reexecutar o
      // seed não deve sobrescrever um conteúdo que a equipe já editou pela
      // própria tela do editor.
      const hasDraft = await prisma.templateDraft.findUnique({
        where: { templateId },
        select: { templateId: true },
      });

      if (!hasDraft) {
        const contentJson = buildSeedDocument(template.content);
        const contentHtml = generateHTML(contentJson, legalEditorExtensions);
        const documentPayload = {
          contentJson,
          contentHtml,
          variables: [],
          signatures: [],
          pageSettings: defaultPageSettings(),
        };

        await prisma.templateDraft.create({
          data: {
            templateId,
            revision: 1,
            ...documentPayload,
            updatedById: adminUser.id,
          },
        });

        if (template.status === TemplateStatus.ATIVO) {
          await prisma.templateVersion.create({
            data: {
              templateId,
              version: 1,
              ...documentPayload,
              createdById: adminUser.id,
            },
          });
        }
      }

      console.log(`✓ ${template.name}`);
    }

    console.log();

    // Create clients. `document` é único, então serve de chave do upsert.
    for (const { responsibleEmail, address, ...client } of seedClients) {
      const responsible = await prisma.user.findUniqueOrThrow({
        where: { email: responsibleEmail },
        select: { id: true },
      });

      const fields = {
        name: client.name,
        displayName: client.displayName ?? null,
        type: client.type,
        status: client.status,
        email: client.email,
        phone: client.phone ?? null,
        birthDate: client.birthDate ?? null,
        stateRegistration: client.stateRegistration ?? null,
        municipalRegistration: client.municipalRegistration ?? null,
        notes: client.notes ?? null,
        responsibleId: responsible.id,
      };

      await prisma.client.upsert({
        where: { document: client.document },
        create: {
          ...fields,
          document: client.document,
          ...(address ? { address: { create: address } } : {}),
        },
        update: {
          ...fields,
          deletedAt: null,
          // `upsert` aninhado mantém o seed idempotente: reexecutar não
          // duplica o endereço nem falha na unicidade de `client_id`.
          ...(address
            ? { address: { upsert: { create: address, update: address } } }
            : {}),
        },
      });

      console.log(`✓ ${client.name}`);
    }

    console.log();

    // Create attendance forms (fichas). Sem chave natural no modelo, a
    // idempotência usa o par (clientId, subject).
    for (const form of seedAttendanceForms) {
      const client = await prisma.client.findUniqueOrThrow({
        where: { document: form.clientDocument },
        select: {
          id: true,
          name: true,
          displayName: true,
          document: true,
          type: true,
          email: true,
          phone: true,
          address: {
            select: {
              postalCode: true,
              street: true,
              number: true,
              complement: true,
              district: true,
              city: true,
              state: true,
            },
          },
        },
      });

      const [responsible, createdBy, updatedBy, finalizedBy] =
        await Promise.all([
          prisma.user.findUniqueOrThrow({
            where: { email: form.responsibleEmail },
            select: { id: true },
          }),
          prisma.user.findUniqueOrThrow({
            where: { email: form.createdByEmail },
            select: { id: true },
          }),
          prisma.user.findUniqueOrThrow({
            where: { email: form.updatedByEmail },
            select: { id: true },
          }),
          form.finalizedByEmail
            ? prisma.user.findUniqueOrThrow({
                where: { email: form.finalizedByEmail },
                select: { id: true },
              })
            : null,
        ]);

      const attendanceAt = new Date(
        Date.now() - form.daysAgo * 24 * 60 * 60 * 1000,
      );

      // Snapshot imutável do cadastro no momento da ficha, conforme o
      // comentário do modelo: nome, documento, tipo, contatos e endereço.
      const clientSnapshot = {
        name: client.name,
        displayName: client.displayName,
        document: client.document,
        type: client.type,
        email: client.email,
        phone: client.phone,
        address: client.address,
      };

      const fields = {
        status: form.status,
        channel: form.channel ?? null,
        contactPerson: form.contactPerson ?? null,
        subject: form.subject,
        legalArea: form.legalArea ?? null,
        clientReport: form.clientReport ?? null,
        preliminaryAnalysis: form.preliminaryAnalysis ?? null,
        responsibleId: responsible.id,
        updatedById: updatedBy.id,
        finalizedById: finalizedBy?.id ?? null,
        finalizedAt: finalizedBy ? attendanceAt : null,
      };

      const existing = await prisma.clientAttendanceForm.findFirst({
        where: { clientId: client.id, subject: form.subject },
        select: { id: true },
      });

      if (existing) {
        await prisma.clientAttendanceAction.deleteMany({
          where: { attendanceFormId: existing.id },
        });

        await prisma.clientAttendanceForm.update({
          where: { id: existing.id },
          data: {
            ...fields,
            deletedAt: null,
            clientSnapshot,
            actions: {
              create: form.actions.map((type, position) => ({
                type,
                position,
              })),
            },
          },
        });
      } else {
        await prisma.clientAttendanceForm.create({
          data: {
            ...fields,
            clientId: client.id,
            createdById: createdBy.id,
            clientSnapshot,
            attendanceAt,
            actions: {
              create: form.actions.map((type, position) => ({
                type,
                position,
              })),
            },
          },
        });
      }

      console.log(`✓ ${form.subject}`);
    }

    console.log(
      `\n${seedUsers.length} usuários, ${seedTemplates.length} templates, ${seedClients.length} clientes e ${seedAttendanceForms.length} fichas disponíveis.`,
    );

    if (!process.env.SEED_PASSWORD) {
      console.log(`Senha padrão de desenvolvimento: ${DEFAULT_PASSWORD}`);
    }
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
