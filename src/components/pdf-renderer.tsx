'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from './ui/icons';

type Props = { url: string };

const PdfRenderer = ({ url }: Props) => {
  const [pages, setPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  return (
    <div className='w-full bg-background rounded-md shadow-sm flex flex-col items-center'>
      <div className='h-14 w-full border-b rounded-md flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          <Button
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              // setValue('page', String(currentPage - 1));
            }}
            variant='ghost'
            aria-label='previous page'
          >
            <Icons.chevronDown className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfRenderer;
