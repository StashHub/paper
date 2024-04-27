import { trpc } from '@/utils/trpc';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import type { AddFileInput } from '@/types/trpc';

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
  const exist = trpc.file.exist.useQuery({ key: file.key });
  if (exist.data) return;

  const input: AddFileInput = {
    key: file.key,
    name: file.name,
    url: file.url,
    userId: metadata.userId,
    status: 'PROCESSING',
  };
  const createdFile = await trpc.file.add.useMutation().mutateAsync(input);

  try {
    const response = await fetch(
      `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
    );
  } catch (error) {
    trpc.file.update.useMutation().mutate({
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