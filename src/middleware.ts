import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import type { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

type NextRequestWithAuth = Request & {
  kindeAuth: { user: KindeUser; token: string };
};

export default function middleware(req: NextRequestWithAuth) {
  return withAuth(req);
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth-callback'],
};
