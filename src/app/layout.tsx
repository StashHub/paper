import '@/styles/globals.css';
import type { Metadata } from 'next';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import ThemeProvider from '@/components/theme-provider';

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
    <html lang='en' suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen font-sans antialiased grainy',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
