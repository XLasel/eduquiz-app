import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { UserInitializer } from '@/redux/UserInitializer';
import { cn } from '@/lib/utils';

import { AppFooter, AppHeader } from '@/components/common';

import {
  SITE_DESCRIPTION,
  SITE_DESCRIPTION_ALT,
  SITE_SHORT_TITLE,
  SITE_TITLE,
} from '@/config';
import { AppProvider } from '@/providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    'тесты',
    'обучение',
    'образовательные тесты',
    'создать тест',
    'пройти тест',
    'EduQuiz',
  ],
  icons: [
    {
      media: '(prefers-color-scheme: light)',
      url: '/icons/icon-light.svg',
      type: 'image/svg+xml',
    },
    {
      media: '(prefers-color-scheme: dark)',
      url: '/icons/icon-dark.svg',
      type: 'image/svg+xml',
    },
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION_ALT,
    url: process.env.NEXT_PUBLIC_HOST_URL,
    siteName: SITE_SHORT_TITLE,
    images: [
      {
        url: '/images/eduquiz-logo.png',
        width: 1200,
        height: 630,
        alt: 'EduQuiz Logo',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ru">
      <body
        className={cn(
          'flex min-h-screen flex-col bg-background font-sans antialiased',
          inter.className
        )}
      >
        <AppProvider>
          <UserInitializer />
          <AppHeader />
          <main className="flex grow flex-col">{children}</main>
          <AppFooter />
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
