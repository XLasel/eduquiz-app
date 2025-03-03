import { StoreProvider } from '@/redux/StoreProvider';

import { RouteHistoryProvider } from './RouteHistoryProvider';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from './Toaster';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <StoreProvider>
        <RouteHistoryProvider>
          {children}
          <Toaster />
        </RouteHistoryProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};
