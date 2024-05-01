'use client';

import Link from 'next/link';
import { api } from '@/trpc/react';
import { Icons } from '@/components/ui/icons';
import { Status } from '@prisma/client';
import Messages from '@/app/dashboard/components/messages';
import ChatInput from '@/app/dashboard/components/chat-input';
import { buttonVariants } from '@/components/ui/button';
import { ChatProvider } from '../context/chat';

type Props = { fileId: string; subscribed: boolean };

interface RenderStateProps {
  icon: React.ReactNode;
  message: string;
  children?: React.ReactNode;
}

const ChatWrapper = ({ fileId, subscribed }: Props) => {
  const { data, isLoading } = api.file.status.useQuery(
    { id: fileId },
    {
      refetchInterval: (data) =>
        data?.status === Status.SUCCESS || data?.status === Status.FAILED
          ? false
          : 500,
    }
  );

  const renderState = ({ icon, message, children }: RenderStateProps) => (
    <div className='relative min-h-full bg-background flex divide-y divide-background flex-col justify-between gap-2'>
      <div className='flex flex-1 justify-center items-center flex-col mb-28'>
        <div className='flex flex-col items-center gap-2'>
          {icon}
          <p className='text-zinc-500'>{message}</p>
          {children}
        </div>
      </div>
      <ChatInput disabled />
    </div>
  );

  if (isLoading) {
    return renderState({
      icon: <Icons.loader className='h-7 w-7 text-primary animate-spin' />,
      message: 'Loading...',
    });
  }

  if (data?.status === Status.PROCESSING) {
    return renderState({
      icon: <Icons.loader className='h-7 w-7 text-primary animate-spin' />,
      message: 'Processing...',
    });
  }

  if (data?.status === 'FAILED') {
    return renderState({
      icon: <Icons.error className='h-7 w-7 text-red-500' />,
      message: 'Too many pages in PDF...',
      children: (
        <Link
          href='/dashboard'
          className={buttonVariants({
            variant: 'secondary',
            className: 'mt-4',
          })}
        >
          <Icons.chevronLeft className='h-3 w-3 mr-1.5' />
          Back
        </Link>
      ),
    });
  }

  return (
    <ChatProvider fileId={fileId}>
      <div className='flex flex-col relative min-h-full bg-background divide-y justify-between gap-2'>
        <div className='flex-1 justify-between flex flex-col mb-28'>
          <Messages id={fileId} />
        </div>
        <ChatInput />
      </div>
    </ChatProvider>
  );
};

export default ChatWrapper;
