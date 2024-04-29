'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import PdfExpand from '@/components/pdf-expand';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SimpleBar from 'simplebar-react';

import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { z } from 'zod';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = { url: string };

const PdfRenderer = ({ url }: Props) => {
  const [pages, setPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;
  const { width, ref } = useResizeDetector();

  const schema = z.object({
    page: z
      .string()
      .refine((page) => Number(page) > 0 && Number(page) <= pages!),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      page: String(currentPage),
    },
  });
  console.log(errors);

  const onSubmit = ({ page }: z.infer<typeof schema>) => {
    setCurrentPage(Number(page));
    setValue('page', String(page));
  };

  return (
    <div className='flex flex-col items-center w-full bg-background shadow-sm border border-muted rounded-t-lg '>
      <div className='h-14 w-full border-b border-muted flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          <Button
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue('page', String(currentPage - 1));
            }}
            variant='ghost'
            aria-label='previous page'
          >
            <Icons.chevronDown className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-1.5'>
            <Input
              {...register('page')}
              className={cn(
                'w-12 h-8',
                errors.page && 'focus-visible:ring-red-500'
              )}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit(onSubmit)();
                }
              }}
            />
            <p className='text-zinc-700 text-sm space-x-1'>
              <span>/</span>
              <span>{pages ?? 'x'}</span>
            </p>
          </div>

          <Button
            disabled={currentPage === pages || pages === undefined}
            onClick={() => {
              setCurrentPage((prev) => (prev + 1 > pages! ? pages! : prev + 1));
              setValue('page', String(currentPage + 1));
            }}
            variant='ghost'
            aria-label='next page'
          >
            <Icons.chevronUp className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
                <Icons.search className='h-4 w-4' />
                {scale * 100}%
                <Icons.chevronDown className='h-3 w-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant='ghost'
            aria-label='rotate 90'
          >
            <Icons.rotate className='w-4 h-4' />
          </Button>

          <PdfExpand url={url} />
        </div>
      </div>

      <div className='flex-1 w-full max-h-screen'>
        <SimpleBar autoHide={true} className='max-h-[calc(100vh-10rem)]'>
          <div ref={ref}>
            <Document
              className='max-h-full'
              file={url}
              loading={
                <div className='flex justify-center'>
                  <Icons.loader className='my-24 h-6 w-6 animate-spin' />
                </div>
              }
              onLoadError={() => {
                toast('Error loading PDF', {
                  description: 'Please try again later',
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setPages(numPages);
              }}
            >
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  key={renderedScale}
                />
              ) : null}

              <Page
                className={cn(isLoading ? 'hidden' : '')}
                pageNumber={currentPage}
                width={width ? width : 1}
                scale={scale}
                rotate={rotation}
                key={scale}
                loading={
                  <div className='flex justify-center'>
                    <Icons.loader className='my-24 h-6 w-6 animate-spin' />
                  </div>
                }
                onRenderSuccess={() => {
                  setRenderedScale(scale);
                }}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
