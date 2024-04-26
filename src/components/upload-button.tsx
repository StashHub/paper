'use client';

import { useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import UploadDropzone from './drop-zone';
import { Subscribed } from '@/types/stripe';

const UploadButton = ({ subscribed }: Subscribed) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(!!v)}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone subscribed={subscribed} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
