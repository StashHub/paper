import { api } from '@/trpc/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import type { AddFileInput } from '@/types/trpc';
import { prisma } from '@/server/prisma';

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
    status: 'PROCESSING',
  };
  const createdFile = await prisma.file.create({
    data: input,
    select: { id: true },
  });

  try {
    const response = await fetch(file.url);
    const blob = response.blob()
    
  } catch (error) {
    api.file.update.mutate({
      id: createdFile.id,
      status: 'FAILED',
    });
    console.log('File upload failed', createdFile.id);
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
