import Link from 'next/link';

import { cn } from '@/lib/utils';

import { APP_ROUTES } from '@/constants';

export const Logo = ({ href = APP_ROUTES.HOME }: { href?: string }) => (
  <Link className="flex items-center gap-2 px-1 py-2" href={href}>
    <LogoIcon className="h-6 w-6 text-foreground" />
    <span className="inline-block text-[32px] text-xl font-extrabold">
      EduQuiz<span className="text-brand">.</span>
    </span>
  </Link>
);

export const LogoIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 36 35"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('h-9 w-9', className)}
    {...props}
  >
    <path
      d="M30.76 12.41L30.74 7.46C30.74 5.85 29.04 4.43 27.1 4.43L20.31 4.43C20.32 2.09 18 1 15.15 1C12.29 1 9.99 2.09 9.99 4.37C9.99 4.39 4.58 4.43 4.58 4.43C2.64 4.43 1 5.85 1 7.46L1.07 12.22C3.89 12.25 6.17 14.08 6.17 16.34C6.17 18.6 3.89 20.42 1.07 20.45L1.07 26.09C1.07 27.7 2.64 29 4.58 29L27.1 29C29.04 29 30.82 27.7 30.82 26.09L30.8 20.62C33.27 20.37 35 18.64 35 16.51C35 14.38 33.26 12.64 30.76 12.41Z"
      fill="inherit"
      fillOpacity="1"
      fillRule="evenodd"
    />
    <path
      d="M30.74 7.46C30.74 5.85 29.04 4.43 27.1 4.43L20.31 4.43C20.32 2.09 18 1 15.15 1C12.29 1 9.99 2.09 9.99 4.37C9.99 4.39 4.58 4.43 4.58 4.43C2.64 4.43 1 5.85 1 7.46L1.07 12.22C3.89 12.25 6.17 14.08 6.17 16.34C6.17 18.6 3.89 20.42 1.07 20.45L1.07 26.09C1.07 27.7 2.64 29 4.58 29L27.1 29C29.04 29 30.82 27.7 30.82 26.09L30.8 20.62C33.27 20.37 35 18.64 35 16.51C35 14.38 33.26 12.64 30.76 12.41L30.74 7.46Z"
      className="fill-foreground"
      strokeOpacity="0"
      strokeWidth="47.058823"
    />
  </svg>
);
