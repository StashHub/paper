import Navbar from '@/components/nav';
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { marketing } from '@/config/marketing';
import { cn } from '@/lib/utils';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';

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
              <div className='hidden items-center space-x-4 lg:flex'>
                <ThemeToggle />
                <LoginLink
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'px-4'
                  )}
                >
                  Signin
                </LoginLink>
                <RegisterLink
                  className={cn(buttonVariants({ size: 'sm' }), 'px-4')}
                >
                  Get Started
                </RegisterLink>
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
