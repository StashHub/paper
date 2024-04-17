/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client';

import { env } from '@/env';

const global = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize the PrismaClient instance or use the existing global instance
export const db =
  global.prisma ??
  new PrismaClient({
    // Configure Prisma client logging based on the environment
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Assign the PrismaClient instance to the global object in development
if (env.NODE_ENV !== 'production') global.prisma = db;
