'use client';

import Link from 'next/link';

import { APP_ROUTES } from '@/constants';
import { useCallbackUrl } from '@/hooks';

export const LinkCallback = ({
  name,
  href = APP_ROUTES.TESTS.LIST,
}: {
  name: string;
  href?: string;
}) => {
  const callbackurl = useCallbackUrl();
  const redirectUrl = callbackurl;

  return (
    <Link
      href={{
        pathname: href,
        query: { callbackUrl: redirectUrl },
      }}
      className="text-blue-500"
    >
      {name}
    </Link>
  );
};
