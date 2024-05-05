import React, { useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api } from '@/trpc/react';
import { Icons } from '@/components/ui/icons';
import { useChatContext } from '../context/chat';
import { Message as ChatMessage } from './message';
import type { Message } from '@/types/trpc';
import { Skeleton } from '@/components/ui/skeleton';

type Props = { id: string };

const Messages = ({ id }: Props) => {
  const { isLoading: isAiThinking } = useChatContext();
  const { data, isLoading, fetchNextPage } = api.file.messages.useInfiniteQuery(
    { fileId: id, limit: 10 },
    { getNextPageParam: (page) => page?.nextCursor, keepPreviousData: true }
  );

  const messageRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: messageRef.current,
    threshold: 1,
  });

  const messages = data?.pages.flatMap((page) => page.messages);
  const messageLoading: Message = {
    id: 'loading',
    createdAt: new Date(),
    text: (
      <span className='flex h-full items-center justify-center'>
        <Icons.loader className='h-4 w-4 animate-spin' />
      </span>
    ),
    owner: false,
  };

  const combined = [
    ...(isAiThinking ? [messageLoading] : []),
    ...(messages ?? []),
  ];

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  return (
    <div className='flex flex-1 flex-col-reverse max-h-[calc(100vh-3.5rem-7rem)] gap-4 p-3 overflow-y-auto'>
      {combined && combined.length > 0 ? (
        combined.map((message, index) => {
          return (
            <ChatMessage
              ref={index === combined.length - 1 ? ref : undefined}
              message={message}
              sameOwner={
                index > 0 && combined[index - 1]?.owner === message.owner
              }
              key={message.id}
            />
          );
        })
      ) : isLoading ? (
        <Skeleton.Chat className='w-full' />
      ) : (
        <div className='flex-1 flex flex-col items-center justify-center gap-2'>
          <Icons.bot className='h-8 w-8' />
          <h3 className='font-semibold text-xl'>You&apos;re all set!</h3>
          <p className='text-zinc-500 text-sm'>
            What&apos;s on your mind? Ask away!
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
