import { router, protectedProcedure } from '@/server/trpc';

export const userRouter = router({
  byId: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.getById(ctx.session.user?.id);
  }),
});
