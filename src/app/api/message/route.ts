import { prisma } from '@/server/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { env } from '@/env';
import { pinecone } from '@/lib/pinecone';
import { openai } from '@/lib/openai';
import { z } from 'zod';
import { api } from '@/trpc/server';
import type { CreateMessageInput } from '@/types/trpc';

const schema = z.object({
  fileId: z.string(),
  message: z.string(),
});

export const POST = async (req: NextRequest) => {
  // Get the user object from the session
  const { getUser } = getKindeServerSession(req);
  const user = await getUser();
  if (!user || !user.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { fileId, message } = schema.parse(await req.json());
  const file = await api.file.get.query({ id: fileId });
  if (!file)
    return NextResponse.json({ error: 'File not found' }, { status: 404 });

  // Create a new message in the database
  const input: CreateMessageInput = {
    text: message,
    owner: !!user,
    userId: user.id,
    fileId: fileId,
  };
  const created = await api.message.create.mutate(input);
  console.log('Message created', created.id);

  // Vectorize the message using the OpenAI embeddings
  const embeddings = new OpenAIEmbeddings({
    apiKey: env.OPENAI_API_KEY,
  });

  // Create a Pinecone index with the file's ID as the namespace
  const pineconeIndex = pinecone.Index(env.PINECONE_INDEX);
  const store = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  // Search for similar messages in the Pinecone index
  const results = await store.similaritySearch(message, 5);

  // Find the last 8 messages in the file
  const messages = await prisma.message.findMany({
    where: { fileId },
    orderBy: { createdAt: 'asc' },
    take: 8,
  });

  // Format the messages as an array of objects with 'role' and 'content' properties
  const formattedMessages = messages.map((message) => ({
    role: message.owner ? ('user' as const) : ('assistant' as const),
    content: message.text,
  }));

  // Create a new OpenAI completion with the formatted messages and the context
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          "Please use the provided context to answer the user's question in markdown format.",
      },
      {
        role: 'user',
        content: `Use the context and previous conversation below to answer the user's question in markdown format.
          If unsure, state that you don't know instead of guessing.

          ----------------

          Previous Conversation:
          ${formattedMessages
            .map((message) => `${message.role}: ${message.content}`)
            .join('\n')}

          ----------------

          Context:
          ${results.map((result) => result.pageContent).join('\n\n')}

          Prompt: ${message}`,
      },
    ],
  });

  // Create a new OpenAI stream with the completion
  const stream = OpenAIStream(response, {
    onCompletion: async (completion) => {
      const _message = await prisma.message.create({
        data: {
          userId: user.id,
          fileId: fileId,
          text: completion,
          owner: false,
        },
      });
      console.log('AI message created', _message);
    },
  });
  return new StreamingTextResponse(stream);
};
