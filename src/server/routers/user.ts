import { router, authProcedure } from '@/server/trpc';

export const userRouter = router({
  byId: authProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.getById(ctx.session.user?.id);
  }),
});
