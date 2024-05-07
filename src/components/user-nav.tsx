import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

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
      <DropdownMenuContent className='w-56 px-3 py-3' align='end' forceMount>
        <DropdownMenuLabel className='font-medium'>
          <div className='flex flex-1 flex-col space-y-1.5'>
            <p className='text-sm leading-none'>{name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='mt-2 mb-2' />
        <DropdownMenuItem>
          <LogoutLink className='w-full text-red-600'>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
