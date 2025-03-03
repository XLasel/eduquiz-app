import { LogOut } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcnUi/dropdownMenu';

import { ProfileAvatar } from './ProfileAvatar';

export const Profile = ({
  username,
  isAdmin,
  handleLogout,
}: {
  username: string;
  isAdmin: boolean;
  handleLogout: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfileAvatar username={username} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Привет, {username} 👋</DropdownMenuLabel>
        <DropdownMenuLabel className="text-xs font-normal">
          <p className="font-semibold">Твоя роль: </p>
          <p>{isAdmin ? 'Администратор' : 'Пользователь'}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex cursor-pointer justify-between"
          >
            Выйти
            <LogOut className="px-1" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
