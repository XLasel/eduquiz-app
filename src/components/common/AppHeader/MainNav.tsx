import Link from 'next/link';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/shadcnUi/button';

import { APP_ROUTES } from '@/constants';

const linkItems = [
  {
    name: 'Главная',
    href: APP_ROUTES.HOME,
  },
  {
    name: 'Каталог тестов',
    href: APP_ROUTES.TESTS.LIST,
  },
];

export const MainNav = ({
  onLinkClick,
}: {
  onLinkClick?: (href: string) => void;
}) => {
  return (
    <nav className="flex grow flex-col items-start gap-3 md:flex-row md:items-center">
      {linkItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            buttonVariants({
              variant: 'link',
            }),
            'w-full justify-start font-bold md:w-auto md:justify-center'
          )}
          onClick={(e) => {
            if (onLinkClick === undefined) return;
            e.preventDefault();
            onLinkClick(item.href);
          }}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
