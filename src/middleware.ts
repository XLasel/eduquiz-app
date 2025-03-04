import { NextRequest, NextResponse } from 'next/server';

import { APP_ROUTES, SESSION_COOKIE_NAME } from './constants';

const authRoutes = [APP_ROUTES.AUTH.LOGIN, APP_ROUTES.AUTH.REGISTER];
const protectedRoutes = [/^\/tests(\/.*)?$/];

type PathMatcher = string | RegExp;

export function isRouteMatcher(
  req: NextRequest,
  allowedRoutes: PathMatcher[]
): boolean {
  const currentPath = req.nextUrl.pathname;
  return allowedRoutes.some((route) =>
    typeof route === 'string' ? currentPath === route : route.test(currentPath)
  );
}

export default function middleware(req: NextRequest) {
  const auth = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const url = req.nextUrl;
  const currentPath = url.pathname + url.search;
  const callbackUrl = url.searchParams.get('callbackUrl');

  const finalCallbackUrl = callbackUrl || currentPath;

  if (auth && isRouteMatcher(req, authRoutes)) {
    return NextResponse.redirect(
      new URL(finalCallbackUrl || APP_ROUTES.HOME, req.url)
    );
  }

  if (!auth && isRouteMatcher(req, protectedRoutes)) {
    const loginUrl = new URL(APP_ROUTES.AUTH.LOGIN, req.nextUrl.origin);

    loginUrl.searchParams.set('callbackUrl', finalCallbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
