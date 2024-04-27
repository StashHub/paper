import { router, authProcedure } from '@/server/trpc';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  callback: authProcedure.query(async ({ ctx }) => {
    const exist = await ctx.prisma.user.exists({
      id: ctx.session.user?.id,
    });
    if (!exist) {
      await ctx.prisma.user.create({
        data: {
          id: ctx.session.user.id,
          email: ctx.session.user.email!,
        },
      });
    }
    return { success: true };
  }),
});
