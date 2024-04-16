import Link from 'next/link';

import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons';

const Announcement = () => {
  return (
    <Link
      href='/docs'
      className='inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium'
    >
      🎉 <Separator className='mx-2 h-4' orientation='vertical' />{' '}
      <span className='sm:hidden'>New components and more.</span>
      <span className='hidden sm:inline'>
        Announcing our next round of funding.
      </span>
      <Icons.chevronRight className='ml-1 h-3 w-3' />
    </Link>
  );
};

export default Announcement;
