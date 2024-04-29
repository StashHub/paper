'use client';

import { toast } from 'sonner';
import Dropzone from 'react-dropzone';
import { Subscribed } from '@/types/stripe';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUploadThing } from '@/utils/uploadthing';
import { api } from '@/trpc/react';
import { Icons } from '@/components/ui/icons';
import { Progress } from '@/components/ui/progress';

const UploadDropzone = ({ subscribed }: Subscribed) => {
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { startUpload } = useUploadThing(subscribed ? 'pro' : 'free');

  const { mutate: startPolling } = api.file.byKey.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const simulateProgress = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((progress) => {
        if (progress >= 95) {
          clearInterval(interval);
          return progress;
        }
        return progress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (file) => {
        setUploading(true);

        const progress = simulateProgress();
        const response = await startUpload(file);

        if (!response) {
          return toast('Something went wrong', {
            description: 'Please try again later',
          });
        }

        const [fileResponse] = response;
        const key = fileResponse.key;

        if (!key) {
          return toast('Something went wrong', {
            description: 'Please try again later',
          });
        }

        clearInterval(progress);
        setProgress(100);

        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className='border border-muted h-64 m-4 border-dashed rounded-lg'
        >
          <div className='flex items-center justify-center h-full w-full'>
            <label
              htmlFor='dropzone'
              className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Icons.cloud className='h-6 w-6 text-zinc-500 mb-2' />
                <p className='mb-2 text-sm text-zinc-700'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-zinc-500'>
                  PDF (up to {subscribed ? '16' : '4'}MB)
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className='max-w-xs bg-background flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                  <div className='px-3 py-2 h-full grid place-items-center'>
                    <Icons.file className='h-4 w-4 text-blue-500' />
                  </div>
                  <div className='px-3 py-2 h-full text-sm truncate'>
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {uploading ? (
                <div className='w-full mt-4 max-w-xs mx-auto'>
                  <Progress
                    color={progress === 100 ? 'bg-green-500' : ''}
                    value={progress}
                    className='h-1 w-full bg-zinc-200'
                  />
                  {progress === 100 ? (
                    <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                      <Icons.loader className='h-3 w-3 animate-spin' />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input
                {...getInputProps()}
                type='file'
                id='dropzone-file'
                className='hidden'
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;
