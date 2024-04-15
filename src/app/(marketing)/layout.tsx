import Navbar from '@/components/nav';
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { marketing } from '@/config/marketing';
import { cn } from '@/lib/utils';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <header className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 '>
        <div className='mx-auto w-full max-w-screen-xl px-2.5 md:px-20'>
          <div className='flex h-15 items-center justify-between py-4'>
            <Navbar items={marketing} />
            <nav>
              <div className='flex items-center'>
                <ThemeToggle />
                <Link
                  href='/signin'
                  className={cn(buttonVariants({ size: 'sm' }), 'px-4')}
                >
                  Signin
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
