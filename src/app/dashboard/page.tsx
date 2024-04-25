import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';

const Page = async () => {
  return (
    <>
      <h1>Dashboard</h1>
      <LogoutLink>Logout</LogoutLink>
    </>
  );
};

export default Page;
