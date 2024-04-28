import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import EmptyPlaceholder from '@/components/empty-placeholder';

const NotFound = () => {
  return (
    <EmptyPlaceholder className='mx-auto mt-10 max-w-[920px]'>
      <EmptyPlaceholder.Icon name='warning' />
      <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        This file could not be found. Please try again.
      </EmptyPlaceholder.Description>
      <Link href='/dashboard' className={buttonVariants({ variant: 'ghost' })}>
        Go to Dashboard
      </Link>
    </EmptyPlaceholder>
  );
};

export default NotFound;
