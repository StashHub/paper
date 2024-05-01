import { experimental_createTRPCNextAppDirServer } from '@trpc/next/app-dir/server';
import { experimental_nextHttpLink } from '@trpc/next/app-dir/links/nextHttp';
import { loggerLink } from '@trpc/client';

import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/server/routers/_app';
import { transformer } from '@/lib/transformer';
import { absolute } from '@/lib/utils';
import { cookies } from 'next/headers';

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        experimental_nextHttpLink({
          batch: true,
          url: absolute('/api/trpc'),

          headers() {
            return {
              cookie: cookies().toString(),
              'x-trpc-source': 'rsc-http',
            };
          },
        }),
      ],
      transformer,
    };
  },
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
