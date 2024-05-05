import { cn } from '@/lib/utils';

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-muted', className)}
      {...props}
    />
  );
};

Skeleton.Document = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('max-w-3xl mx-auto p-4', className)} {...props}>
      {/* document header */}
      <Skeleton className='h-8 w-3/4 mb-4' />

      {/* document content */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className='mb-4'>
          {/* paragraph */}
          <Skeleton className='h-4 w-full mb-2' />
          <Skeleton className='h-4 w-5/6 mb-2' />
          <Skeleton className='h-4 w-4/6 mb-2' />

          {/* image */}
          <Skeleton className='h-32 w-full mb-2' />
        </div>
      ))}
    </div>
  );
};

Skeleton.Chat = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex flex-col space-y-3', className)} {...props}>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={cn('flex', {
            'justify-start': index % 2 === 0,
            'justify-end': index % 2 !== 0,
          })}
        >
          <Skeleton
            className={cn('h-24', {
              'w-8/12 h-28': index % 2 === 0,
              'w-3/5': index % 2 !== 0,
            })}
          />
        </div>
      ))}
    </div>
  );
};

export { Skeleton };
