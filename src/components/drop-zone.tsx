import { toast } from 'sonner';
import { Subscribed } from '@/types/stripe';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const UploadDropzone = ({ subscribed }: Subscribed) => {
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(false);

  return <>Hello</>;
};

export default UploadDropzone;
