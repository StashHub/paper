import { router, authProcedure } from '@/server/trpc';
import { Prisma, Status } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const FileStatus: [Status, ...Status[]] = Object.values(Status) as [
  Status,
  ...Status[]
];

const defaultMessageSelect = {
  id: true,
  owner: true,
  text: true,
  createdAt: true,
} satisfies Prisma.MessageSelect;

export const fileRouter = router({
  list: authProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.file.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),
  get: authProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      if (!file) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No file with id '${input.id}'`,
        });
      }
      return file;
    }),
  byKey: authProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.findFirst({
        where: { key: input.key, userId: ctx.session.user.id },
      });
      if (!file) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No file with id '${input.key}'`,
        });
      }
      return file;
    }),
  exist: authProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
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
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.create({
        data: input,
        select: { id: true },
      });
      return file;
    }),
  delete: authProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.update({
        data: { status: input.status },
        where: { id: input.id },
        select: { id: true },
      });
      return file;
    }),
  status: authProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      return { status: file ? file.status : ('PENDING' as const) };
    }),
  messages: authProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor, fileId } = input;

      const file = await ctx.prisma.file.findUnique({
        where: { id: input.fileId, userId: ctx.session.user.id },
      });
      if (!file) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No file with id '${input.fileId}'`,
        });
      }
      const messages = await ctx.prisma.message.findMany({
        select: defaultMessageSelect,
        take: limit + 1,
        where: { fileId },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return { messages, nextCursor };
    }),
});
