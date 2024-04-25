import { env } from '@/env';
import { createContext } from '@/server/context';
import { appRouter } from '@/server/routers/_app';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            );
          }
        : ({ error }) => {
            if (error.code == 'INTERNAL_SERVER_ERROR') {
              // send to bug reporting
              console.log('Something went wrong', error);
            }
          },
  });

export { handler as GET, handler as POST };
