'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { useIsClient } from '@/hooks';

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
};
