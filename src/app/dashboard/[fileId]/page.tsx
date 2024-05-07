import ChatWrapper from '@/app/dashboard/components/chat-wrapper';
import PdfRenderer from '@/components/pdf-renderer';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import UserNav from '@/components/user-nav';
import { api } from '@/trpc/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

type Props = { params: { fileId: string } };

const Page = async ({ params }: Props) => {
  const { fileId } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await api.file.get.query({ id: fileId });
  if (!file) notFound();

  return (
    <>
      <section className='flex h-15 items-center justify-between py-4 px-2 md:px-8'>
        <Link
          aria-label='go back'
          href='/dashboard'
          className={buttonVariants({ variant: 'secondary' })}
        >
          <Icons.chevronLeft className='h-4 w-4 mr-1.5' />
          Back
        </Link>
        <p className='font-medium text-sm'>{file.name}</p>
        <UserNav
          email={user?.email ?? ''}
          name={
            !user?.given_name || !user.family_name
              ? 'Hello!'
              : `${user.given_name} ${user.family_name}`
          }
          image={user?.picture ?? ''}
        />
      </section>
      <section className='flex flex-col flex-1 justify-between h-[calc(100vh-3.5rem)]'>
        <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
          {/* pdf viewer */}
          <div className='flex-1 xl:flex'>
            <div className='px-4 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
              <PdfRenderer url={file.url} />
            </div>
          </div>
          {/* chat */}
          <div className='shrink-0 flex-[0.75] border-t border lg:w-96 lg:border-l lg:border-t-0'>
            <ChatWrapper subscribed={false} fileId={file.id} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
