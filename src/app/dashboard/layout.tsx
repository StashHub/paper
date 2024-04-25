import Navbar from '@/components/nav';
import UserNav from '@/components/user-nav';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <header className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 '>
        <div className='mx-auto w-full max-w-screen-xl px-2.5 md:px-20'>
          <div className='flex h-15 items-center justify-between py-4'>
            <Navbar />
            <nav>
              <div className='hidden items-center space-x-4 lg:flex'>
                <UserNav
                  email={user?.email ?? ''}
                  name={
                    !user?.given_name || !user.family_name
                      ? 'Your Account'
                      : `${user.given_name} ${user.family_name}`
                  }
                  image={user?.picture ?? ''}
                />
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
