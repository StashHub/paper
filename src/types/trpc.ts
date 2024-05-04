import { RouterInput, RouterOutput } from '@/trpc/server';

export type AddFileInput = RouterInput['file']['add'];
export type CreateMessageInput = RouterInput['message']['create'];

type Messages = RouterOutput['file']['messages'];
export type Message = Omit<Messages['messages'][number], 'text'> & {
  text: string | JSX.Element;
};
