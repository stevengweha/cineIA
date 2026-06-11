import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Cette option désactive les prepared statements au niveau du driver
    // Cela résout le conflit "already exists" sur Vercel/Serverless
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}?pgbouncer=true`,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;