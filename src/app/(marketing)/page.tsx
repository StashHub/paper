import { Icons } from '@/components/ui/icons';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
  Actions,
  Description,
  Header,
  Heading,
} from '@/components/page-header';
import { cn } from '@/lib/utils';
import Announcement from '@/components/announcement';
import Illustration from '@/components/illustration';

export default async function Home() {
  return (
    <>
      <Header>
        <Announcement />
        <Heading>
          Chat with your <span className='text-blue-600'>documents</span> in
          seconds.
        </Heading>
        <Description>
          Aiden allows you to have conversations with any PDF document. Simply
          upload your file and start asking questions right away.
        </Description>
        <Actions>
          <Link
            href='/dashboard'
            target='_blank'
            className={cn(buttonVariants({ size: 'lg' }), 'w-full md:w-auto')}
          >
            Get Started <Icons.chevronRight className='ml-2 h-5 w-5' />
          </Link>
          <Link
            href='/docs'
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'w-full md:w-auto'
            )}
          >
            Documentation
          </Link>
        </Actions>
      </Header>

      <Illustration source='/dashboard.jpg' alt='product preview' />

      {/* feature */}
      <div className='mx-auto mb-32 mt-324 max-w-5xl sm:mt-48'>
        <div className='mb-12 px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl sm:text-center'>
            <h2 className='mt-2 font-bold text-4xl text-gray-900 sm:text-5xl'>
              Start chatting in minutes
            </h2>
            <p className='mt-4 text-lg text--500'>
              Chatting to your PDF files has never been easier than with Aiden.
            </p>
          </div>
        </div>

        {/* steps */}
        <ol className='my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0'>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-slate-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-blue-600'>Step 1</span>
              <span className='text-xl font-semibold'>
                Sign up for an account
              </span>
              <span className='mt-2 text-slate-700'>
                Either starting out with a free plan or choose our{' '}
                <Link
                  href='/pricing'
                  className='text-blue-700 underline underline-offset-2'
                >
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-slate-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-blue-600'>Step 2</span>
              <span className='text-xl font-semibold'>
                Upload your PDF file
              </span>
              <span className='mt-2 text-slate-700'>
                We&apos;ll process your file and make it ready for you to chat
                with.
              </span>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-slate-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-blue-600'>Step 3</span>
              <span className='text-xl font-semibold'>
                Start asking questions
              </span>
              <span className='mt-2 text-slate-700'>
                It&apos;s that simple. Try out Aiden today - it really takes
                less than a minute.
              </span>
            </div>
          </li>
        </ol>

        <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl shadow-2xl lg:rounded-2xl lg:-m-4'>
              <Image
                src='/file-upload.jpg'
                alt='uploading preview'
                width={1440}
                height={900}
                quality={100}
                className='bg-white shadow-2xl rounded-xl lg:rounded-2xl'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
