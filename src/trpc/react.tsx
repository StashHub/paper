'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loggerLink, httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';

import type { AppRouter } from '@/server/routers/_app';
import { transformer } from '@/utils/transformer';
import { absolute } from '@/lib/utils';

export const api = createTRPCReact<AppRouter>();

export const TRPCProvider = (props: {
  children: React.ReactNode;
  cookies: string;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchLink({
          url: absolute('/api/trpc'),
          headers() {
            return {
              cookie: props.cookies,
              'x-trpc-source': 'react',
            };
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
};
