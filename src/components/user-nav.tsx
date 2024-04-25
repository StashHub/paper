import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Icons } from './ui/icons';
import Link from 'next/link';

type AccountProps = {
  email: string | undefined;
  name: string;
  image: string;
};

const UserNav = ({ email, name, image }: AccountProps) => {
  const subscribed = false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={image} alt='avatar' />
            <AvatarFallback>
              <span className='sr-only'>{name}</span>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          {subscribed ? (
            <Link href='/dashboard/billing'>Manage Subscription</Link>
          ) : (
            <Link href='/pricing'>
              Upgrade <Icons.zap className='text-blue-600 h-4 w-4 ml-1.5' />
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
