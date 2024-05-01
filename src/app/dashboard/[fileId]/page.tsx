import ChatWrapper from '@/app/dashboard/components/chat-wrapper';
import PdfRenderer from '@/components/pdf-renderer';
import { api } from '@/trpc/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from 'next/navigation';

type Props = {
  params: { fileId: string };
};

const Page = async ({ params }: Props) => {
  const { fileId } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await api.file.get.query({ id: fileId });
  if (!file) notFound();

  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        {/* pdf viewer */}
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            <PdfRenderer url={file.url} />
          </div>
        </div>
        {/* chat */}
        <div className='shrink-0 flex-[0.75] border-t border lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper subscribed={false} fileId={file.id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
