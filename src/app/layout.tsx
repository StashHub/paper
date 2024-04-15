import '@/styles/globals.css';
import type { Metadata } from 'next';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Aiden',
  description: 'Chat with PDF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen font-sans antialiased grainy',
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
