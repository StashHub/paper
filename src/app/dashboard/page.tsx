'use client';

import { trpc } from '@/trpc/react';
import Dashboard from './components/dashboard';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  const exist = trpc.user.exist.useQuery();
  if (!exist.data) router.push('/auth-callback?origin=dashboard');

  return <Dashboard />;
};

export default Page;
