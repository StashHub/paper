import { router, authProcedure } from '@/server/trpc';

export const userRouter = router({
  exist: authProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.exists({ id: ctx.session.user.id });
  }),
  byId: authProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.getById(ctx.session.user?.id);
  }),
});
