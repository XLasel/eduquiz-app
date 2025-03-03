import { cn, getUsernameLetters } from '@/lib/utils';

import { Avatar, AvatarFallback } from '@/components/shadcnUi/avatar';

export const ProfileAvatar = ({
  username,
  className,
}: {
  username?: string;
  className?: string;
}) => {
  return (
    <Avatar className={cn(className)}>
      <AvatarFallback>{getUsernameLetters(username ?? '')}</AvatarFallback>
    </Avatar>
  );
};
