import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../app/generated/prisma/client";
import { UserRole } from "../app/generated/prisma/enums";

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

    console.log(`\n${seedUsers.length} usuários disponíveis.`);

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
