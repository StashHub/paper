import { router, authProcedure } from '@/server/trpc';
import { Status } from '@prisma/client';
import { z } from 'zod';

const FileStatus: [Status, ...Status[]] = Object.values(Status) as [
  Status,
  ...Status[]
];

export const fileRouter = router({
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
