import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../app/generated/prisma/client";
import {
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

    console.log(`\n${seedUsers.length} usuários e ${seedTemplates.length} templates disponíveis.`);

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
