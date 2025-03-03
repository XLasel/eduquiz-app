'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { usePathname } from 'next/navigation';

const MAX_HISTORY = 10;

type RouteHistoryContextType = {
  lastRoute: string | null;
  allRoutes: string[];
  findRoute: (regex: RegExp) => string | null;
};

const RouteHistoryContext = createContext<RouteHistoryContextType | undefined>(
  undefined
);

export const RouteHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!pathname) return;

    setHistory((prev) => {
      const newHistory = [...prev, pathname].slice(-MAX_HISTORY);
      return newHistory;
    });
  }, [pathname]);

  const findRoute = useCallback(
    (regex: RegExp): string | null => {
      for (let i = history.length - 1; i >= 0; i--) {
        if (regex.test(history[i])) {
          return history[i];
        }
      }
      return null;
    },
    [history]
  );

  const lastRoute = useMemo(() => history.at(-2) || null, [history]);

  return (
    <RouteHistoryContext.Provider
      value={{ lastRoute, allRoutes: history, findRoute }}
    >
      {children}
    </RouteHistoryContext.Provider>
  );
};

export const usePreviousRoutes = (): RouteHistoryContextType => {
  const context = useContext(RouteHistoryContext);
  if (!context) {
    throw new Error(
      'usePreviousRoutes must be used within a RouteHistoryProvider'
    );
  }
  return context;
};
