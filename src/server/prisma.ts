/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { env } from '@/env';
import { Prisma, PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const db: PrismaClient =
  prismaGlobal.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') prismaGlobal.prisma = db;

// -- Extensions --

export const prisma = db
  .$extends({
    client: { $log: (s: string) => console.log(s) },
  })
  .$extends({
    model: {
      $allModels: {
        // `exists` method available on all models
        async exists<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where']
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this);
          const result = await (context as any).findFirst({ where });
          return result !== null;
        },
        // `getById` method available on all models
        async getById<T>(
          this: T,
          id: string
        ): Promise<Prisma.Result<T, { id: string }, 'findUniqueOrThrow'>> {
          const context = Prisma.getExtensionContext(this);
          return await (context as any).findUniqueOrThrow({ where: { id } });
        },
      },
    },
  });
