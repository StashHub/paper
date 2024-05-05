import React, { useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';
import SimpleBar from 'simplebar-react';
import { Document, Page } from 'react-pdf';
import { toast } from 'sonner';

type Props = {
  url: string;
};
const PdfExpand = ({ url }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState<number>();

  const { width, ref } = useResizeDetector();

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(!!v)}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant='ghost' className='gap-1.5' aria-label='expand'>
          <Icons.expand className='w-4 h-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='w-full max-w-7xl'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
          <div ref={ref}>
            <Document
              className='max-h-full'
              file={url}
              loading={<Skeleton.Document className='max-w-7xl w-full' />}
              onLoadError={() => {
                toast('Error loading document', {
                  description: 'Please try again later',
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setPages(numPages);
              }}
            >
              {[...Array(pages)].map((_, index) => (
                <Page
                  key={index}
                  width={width ? width : 1}
                  pageNumber={index + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfExpand;
