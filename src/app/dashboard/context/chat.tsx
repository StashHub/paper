import { api } from '@/trpc/react';
import { sendMessage } from '@/server/mutations/message';
import { useMutation } from '@tanstack/react-query';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

type ChatContextProps = {
  message: string;
  addMessage: () => void;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<ChatContextProps>({
  message: '',
  addMessage: () => {},
  onChange: () => {},
  isLoading: false,
});

type Props = PropsWithChildren & {
  fileId: string;
};

export const ChatProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const utils = api.useUtils();
  const messageBackup = useRef('');

  const { mutate: send } = useMutation({
    mutationKey: [sendMessage.key],
    mutationFn: (variables: { fileId: string; message: string }) =>
      sendMessage.mutation(variables.fileId, variables.message),
    onMutate: async ({ message }) => {
      setMessage('');

      // Store the message backup
      messageBackup.current = message;

      // Cancel ongoing requests
      await utils.file.messages.cancel();

      // Get previous messages
      const messages = utils.file.messages.getInfiniteData();

      // Update the messages with the new message
      utils.file.messages.setInfiniteData({ fileId, limit: 10 }, (old) => {
        // If there is no previous data, return an empty array for pages and pageParams
        if (!old) return { pages: [], pageParams: [] };

        // Create a new array of pages and get the latest page
        let pages = [...old.pages];
        let latest = pages[0]!;

        // Add the new message to the beginning of the messages array in the latest page
        latest.messages = [
          {
            id: crypto.randomUUID(),
            text: message,
            owner: true,
            createdAt: new Date(),
          },
          ...latest.messages,
        ];

        // Update the first page in the pages array with the latest page
        pages[0] = latest;

        // Return the updated data object
        return { ...old, pages: pages };
      });

      setIsLoading(true);
      return {
        messages: messages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast('There was an error sending message', {
          description: 'Please try again',
        });
      }

      // Get the reader from the stream
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let done = false;
      let accumulated = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        const chunk = decoder.decode(value);
        accumulated += chunk;
        done = doneReading;

        // append chunk to the actual message
        utils.file.messages.setInfiniteData({ fileId, limit: 10 }, (old) => {
          if (!old) return { pages: [], pageParams: [] };

          const updatedPages = old.pages.map((page) => {
            // Check if the current page is the first page
            if (page === old.pages[0]) {
              // Check if the 'ai' message already exists
              const isAiMessageExists = page.messages.some(
                (message) => message.id === 'ai'
              );

              // Create a new messages array with the updated 'ai' message
              const updatedMessages = isAiMessageExists
                ? page.messages.map((message) => {
                    // Update the 'ai' message
                    if (message.id === 'ai') {
                      return {
                        ...message,
                        text: accumulated,
                      };
                    }
                    // Return the original message
                    return message;
                  })
                : [
                    // Create a new 'ai' message
                    {
                      id: 'ai',
                      text: accumulated,
                      owner: false,
                      createdAt: new Date(),
                    },
                    ...page.messages,
                  ];

              // Return the updated page
              return {
                ...page,
                messages: updatedMessages,
              };
            }
            return page;
          });
          return { ...old, pages: updatedPages };
        });
      }
    },
    onError: (_, __, context) => {
      setMessage(messageBackup.current);
      utils.file.messages.setData(
        { fileId },
        { messages: context?.messages ?? [], nextCursor: undefined }
      );
    },
    onSettled: async () => {
      setIsLoading(false);
      // refetch file messages on settled
      await utils.file.messages.invalidate({ fileId });
    },
  });

  const addMessage = () => send({ fileId, message });
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };
  return (
    <ChatContext.Provider
      value={{
        message,
        addMessage,
        onChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
