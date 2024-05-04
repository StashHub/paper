import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '@/types/trpc';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { formatDistance } from 'date-fns';

type MessageProps = { message: Message; sameOwner: boolean };

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ message, sameOwner }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-end', {
          'justify-end': message.owner,
        })}
      >
        <div
          className={cn(
            'relative flex h-6 w-6 aspect-square items-center justify-center',
            {
              'order-2 border border-muted-foreground/60 rounded-full':
                message.owner,
              'order-1 bg-secondary rounded-full': !message.owner,
              invisible: sameOwner,
            }
          )}
        >
          {message.owner ? (
            <Icons.avatar className='text-muted-foreground/60 h-3/4 w-3/4' />
          ) : (
            <Icons.logo className='h-3/4 w-3/4' />
          )}
        </div>

        <div
          className={cn('flex flex-col space-y-2 text-base max-w-md mx-2', {
            'order-1 items-end': message.owner,
            'order-2 items-start': !message.owner,
          })}
        >
          <div
            className={cn('px-4 py-2 rounded-lg inline-block', {
              'bg-primary text-primary-foreground': message.owner,
              'bg-secondary text-secondary-foreground': !message.owner,
              'rounded-br-none': !sameOwner && message.owner,
              'rounded-bl-none': !sameOwner && !message.owner,
            })}
          >
            {typeof message.text === 'string' ? (
              <ReactMarkdown
                className={cn('prose prose-sm', {
                  'text-primary-foreground': message.owner,
                  'text-secondary-foreground': !message.owner,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== 'loading' ? (
              <div
                className={cn('text-xs select-none mt-2 w-full text-right', {
                  'text-secondary-foreground/50': !message.owner,
                  'text-muted-foreground': message.owner,
                })}
              >
                {formatDistance(message.createdAt, new Date(), {
                  addSuffix: true,
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

export { Message };
