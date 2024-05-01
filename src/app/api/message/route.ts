import { prisma } from '@/server/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { env } from '@/env';
import { pinecone } from '@/lib/pinecone';
import { openai } from '@/lib/openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const { fileId, message } = req.body as {
        fileId: string;
        message: string;
      };

      // Get the user object from the session
      const { getUser } = getKindeServerSession(req, res);
      const user = await getUser();
      if (!user || user.id) return res.status(401).end('Unauthorized');

      const file = await prisma.file.findUnique({
        where: { id: fileId, userId: user.id },
      });
      if (!file) return res.status(404).end('File not found');

      // Create a new message object with the provided message text and the user's ID
      const createdMessage = await prisma.message.create({
        data: {
          userId: user.id,
          fileId: fileId,
          text: message,
          owner: !!user,
        },
      });
      console.log('Message created', createdMessage);

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

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
