import { prisma } from '@/server/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { UploadThingError } from 'uploadthing/server';

import type { AddFileInput } from '@/types/trpc';
import { type Prisma, Status } from '@prisma/client';
import { pinecone } from '@/lib/pinecone';
import { env } from '@/env';

const f = createUploadthing();

type Metadata = Awaited<ReturnType<typeof auth>>;
type Uploaded = {
  metadata: Metadata;
  file: {
    key: string;
    name: string;
    url: string;
  };
};

const defaultFileSelect = {
  id: true,
} satisfies Prisma.FileSelect;

const auth = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) throw new UploadThingError('Unauthorized');
  return { userId: user.id };
};

const uploaded = async ({ metadata, file }: Uploaded) => {
  const input: AddFileInput = {
    key: file.key,
    name: file.name,
    url: file.url,
    userId: metadata.userId,
    status: Status.PROCESSING,
  };
  const created = await prisma.file.create({
    data: input,
    select: defaultFileSelect,
  });
  console.log('File created', file.key);

  try {
    const response = await fetch(file.url);
    const blob = await response.blob();

    const loader = new PDFLoader(blob);
    const pdf = await loader.load();

    const pineconeIndex = pinecone.index(env.PINECONE_INDEX);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pdf, embeddings, {
      pineconeIndex,
      namespace: created.id,
    });
    console.log('Embeddings stored', pdf.length);

    const uploaded = await prisma.file.update({
      data: { status: Status.SUCCESS },
      where: { id: created.id },
      select: defaultFileSelect,
    });
    console.log('File upload completed', uploaded.id);
  } catch (error) {
    const updated = await prisma.file.update({
      data: { status: Status.FAILED },
      where: { id: created.id },
      select: defaultFileSelect,
    });
    console.log('File upload failed', updated.id, error);
  }

  return { uploadedBy: metadata };
};

export const ourFileRouter = {
  free: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(auth)
    .onUploadComplete(uploaded),
  pro: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(auth)
    .onUploadComplete(uploaded),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
