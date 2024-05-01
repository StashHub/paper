import { env } from '@/env';
import { Pinecone } from '@pinecone-database/pinecone';

const pineconeGlobal = global as typeof global & {
  pinecone?: Pinecone;
};

export const pinecone: Pinecone =
  pineconeGlobal.pinecone ??
  new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

if (env.NODE_ENV !== 'production') pineconeGlobal.pinecone = pinecone;
