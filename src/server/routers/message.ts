import { router, authProcedure } from '@/server/trpc';
import { z } from 'zod';

export const messageRouter = router({
  create: authProcedure
    .input(
      z.object({
        text: z.string(),
        owner: z.boolean().default(false),
        userId: z.string(),
        fileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({
        data: input,
        select: { id: true },
      });
      return message;
    }),
});
