/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { fileRouter } from './file';
import { userRouter } from './user';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'Yay! 🎉'),

  user: userRouter,
  file: fileRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const api = createCaller(createContext);
 * const res = await api.post.all();
 */
export const createCaller = createCallerFactory(appRouter);
