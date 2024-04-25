import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { type KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { prisma } from '@/server/prisma';

interface CreateContextOptions {
  session: { user: KindeUser | null };
}

// Useful for testing when we don't want to mock Next.js' request/response
export async function createContextInner(_opts: CreateContextOptions) {
  return { session: _opts.session, prisma };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export const createContext = async (opts: {
  headers: Headers;
}): Promise<Context> => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log('createContext for', user?.given_name ?? 'unknown user');

  return await createContextInner({ session: { user }, ...opts });
};

export type Context = Awaited<ReturnType<typeof createContextInner>>;
