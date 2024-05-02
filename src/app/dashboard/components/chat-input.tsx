import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Textarea } from '@/components/ui/textarea';
import React, { useRef } from 'react';
import { useChatContext } from '../context/chat';

type ChatProps = { disabled?: boolean };

const ChatInput = ({ disabled }: ChatProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { message, addMessage, onChange, isLoading } = useChatContext();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addMessage();
      textareaRef.current?.focus();
    }
  };

  return (
    <div className='absolute bottom-0 left-0 w-full rounded-t-lg'>
      <div className='flex flex-row gap-3 mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
        <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
          <div className='relative flex flex-col w-full flex-grow p-4'>
            <div className='relative'>
              <Textarea
                rows={1}
                ref={textareaRef}
                autoFocus
                maxRows={4}
                value={message}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder='Type your message...'
                className='resize-none pr-12 py-3'
              />
              <Button
                className='absolute bottom-1.5 right-[8px]'
                aria-label='send message'
                disabled={disabled || isLoading}
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
              >
                <Icons.send className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
