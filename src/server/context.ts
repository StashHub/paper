import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { type KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { prisma } from '@/server/prisma';

interface CreateContextOptions {
  session: { user: KindeUser | null };
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return { session: _opts.session, prisma };
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(opts: {
  headers: Headers;
}): Promise<Context> {
  // Get the session from the server using the getKindeServerSession wrapper function
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return await createContextInner({ session: { user }, ...opts });
}
