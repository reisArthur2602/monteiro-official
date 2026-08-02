import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { env } from './env';

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

// O adapter (e o `pg.Pool` que ele mantém por dentro) só pode ser criado
// quando um `PrismaClient` novo realmente vai nascer. Criá-lo fora da
// checagem instanciava um Pool a cada hot reload em dev, mesmo quando a
// instância cacheada em `global` já existia e o adapter novo era descartado
// sem ser fechado.
const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter: new PrismaPg({
            connectionString: env.DATABASE_URL,
        }),
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
