import { toast } from 'sonner';
import { Subscribed } from '@/types/stripe';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const UploadDropzone = ({ subscribed }: Subscribed) => {
  const router = useRouter();

  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<boolean>(false);

  return <></>;
};

export default UploadDropzone;
