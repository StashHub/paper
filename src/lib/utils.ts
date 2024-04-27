import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absolute(path: string) {
  if (typeof window !== 'undefined') return path; // Browser should use relative URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`; // SSR should use Vercel URL
  return `http://localhost:${process.env.PORT ?? 3000}${path}`; // Dev SSR should use localhost
}
