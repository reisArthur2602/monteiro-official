import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../app/generated/prisma/client";
import {
  ClientStatus,
  ClientType,
  TemplateCategory,
  TemplateStatus,
  UserRole,
} from "../app/generated/prisma/enums";

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
  },
  {
    name: "Petição Inicial (Cível)",
    description:
      "Estrutura para ação cível com campos variáveis para partes e causa de pedir",
    category: TemplateCategory.PETICAO,
    legalArea: "Cível",
    status: TemplateStatus.ATIVO,
  },
  {
    name: "Procuração Judicial",
    description: "Documento de procuração para representação em juízo",
    category: TemplateCategory.PROCURACAO,
    legalArea: "Geral",
    status: TemplateStatus.ATIVO,
  },
  {
    name: "Notificação de Inadimplência",
    description:
      "Comunicação formal de falta de pagamento com prazo para regularização",
    category: TemplateCategory.NOTIFICACAO,
    legalArea: "Trabalhista",
    status: TemplateStatus.ATIVO,
  },
  {
    name: "Parecer Jurídico",
    description: "Análise de situação jurídica específica com recomendações",
    category: TemplateCategory.OUTRO,
    legalArea: "Geral",
    status: TemplateStatus.RASCUNHO,
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
 */
const seedClients: SeedClient[] = [
  {
    name: "Monteiro Comércio Ltda.",
    displayName: "Monteiro Store",
    document: "12345678000190",
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
    document: "12345678910",
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
    document: "45123987000122",
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
    document: "28456333000144",
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
    document: "32165498720",
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

      if (existing) {
        await prisma.template.update({
          where: { id: existing.id },
          data: {
            description: template.description,
            category: template.category,
            legalArea: template.legalArea,
            status: template.status,
            deletedAt: null,
          },
        });
      } else {
        await prisma.template.create({
          data: {
            name: template.name,
            description: template.description,
            category: template.category,
            legalArea: template.legalArea,
            status: template.status,
            createdById: adminUser.id,
            updatedById: adminUser.id,
          },
        });
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

    console.log(
      `\n${seedUsers.length} usuários, ${seedTemplates.length} templates e ${seedClients.length} clientes disponíveis.`,
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
