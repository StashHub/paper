'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';
import UploadButton from '@/components/upload-button';
import { api } from '@/trpc/react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

const Dashboard = () => {
  const utils = api.useUtils();
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const { data: files, isLoading } = api.file.list.useQuery();

  const deleteFile = api.file.delete.useMutation({
    onSuccess: async () => {
      // refetch files after a file is deleted
      utils.file.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentFile(id);
    },
    onSettled: () => {
      setCurrentFile(null);
    },
  });

  return (
    <main className='mx-auto w-full max-w-screen-xl px-2.5 md:px-20 md:p-10'>
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='mb-3 font-bold text-5xl text-gray-900'>Files</h1>

        <UploadButton subscribed={false} />
      </div>

      {/* display all files */}
      {files && files?.length > 0 ? (
        <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {files.map((file) => (
            <div
              key={file.key}
              className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'
            >
              <Link
                href={`/dashboard/${file.id}`}
                className='flex flex-col gap-2'
              >
                <div className='pt-6 px-6 flex w-full items-center justify-between space-x-6'>
                  <div className='h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500' />
                  <div className='flex-1 truncate'>
                    <div className='flex items-center space-x-3'>
                      <h3 className='truncate text-lg font-medium text-zinc-900'>
                        {file.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>

              <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500'>
                <div className='flex items-center gap-2'>
                  <Icons.plus className='h-4 w-4' />
                  {format(new Date(file.createdAt), 'MMM yyyy')}
                </div>

                <div className='flex items-center gap-2'>
                  <Icons.message className='h-4 w-4' />
                  mocked
                </div>

                <Button
                  onClick={() => deleteFile.mutateAsync({ id: file.id })}
                  size='sm'
                  className='w-full'
                  variant='destructive'
                >
                  {currentFile === file.id ? (
                    <Icons.loader className='h-4 w-4 animate-spin' />
                  ) : (
                    <Icons.trash className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className='w-auto h-72' />
          ))}
        </div>
      ) : (
        <div className='mt-16 flex flex-col items-center gap-2'>
          <Icons.ghost className='h-8 w-8 text-zinc-800' />
          <h3 className='font-semibold text-xl'>Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
