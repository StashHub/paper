import { router, authProcedure } from '@/server/trpc';
import { Status } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const FileStatus: [Status, ...Status[]] = Object.values(Status) as [
  Status,
  ...Status[]
];

export const fileRouter = router({
  list: authProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.file.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),
  exist: authProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.file.exists({ key: input.key });
    }),
  add: authProcedure
    .input(
      z.object({
        key: z.string(),
        name: z.string(),
        userId: z.string(),
        url: z.string().url(),
        status: z.enum(FileStatus),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const file = await ctx.prisma.file.create({
        data: input,
        select: { id: true },
      });
      return file;
    }),
  delete: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const file = await ctx.prisma.file.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!file) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No file with id '${input.id}'`,
        });
      }

      await ctx.prisma.file.delete({ where: { id: input.id } });
      return file;
    }),
  update: authProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(FileStatus),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const file = await ctx.prisma.file.update({
        data: { status: input.status },
        where: { id: input.id },
        select: { id: true },
      });
      return file;
    }),
});
