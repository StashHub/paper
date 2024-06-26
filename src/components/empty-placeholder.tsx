import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';

type EmptyPlaceholderProps = React.HTMLAttributes<HTMLDivElement>;

const EmptyPlaceholder = ({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) => {
  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50',
        className
      )}
      {...props}
    >
      <div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
        {children}
      </div>
    </div>
  );
};

type EmptyPlaceholderIconProps = Partial<React.SVGProps<SVGSVGElement>> & {
  name: keyof typeof Icons;
};

EmptyPlaceholder.Icon = ({
  name,
  className,
  ...props
}: EmptyPlaceholderIconProps) => {
  const Icon = Icons[name];

  if (!Icon) return null;

  return (
    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-muted'>
      <Icon className={cn('h-10 w-10', className)} {...props} />
    </div>
  );
};

type EmptyPlaceholderTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

EmptyPlaceholder.Title = ({
  className,
  ...props
}: EmptyPlaceholderTitleProps) => {
  return (
    <h2 className={cn('mt-6 text-xl font-semibold', className)} {...props} />
  );
};

type EmptyPlaceholderDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

EmptyPlaceholder.Description = ({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) => {
  return (
    <p
      className={cn(
        'mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground',
        className
      )}
      {...props}
    />
  );
};

export default EmptyPlaceholder;
