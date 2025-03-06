import { NextRequest, NextResponse } from 'next/server';

import { APP_ROUTES, SESSION_COOKIE_NAME } from './constants';
import { cookies } from 'next/headers';

const authRoutes = [APP_ROUTES.AUTH.LOGIN, APP_ROUTES.AUTH.REGISTER];
const protectedRoutes = [/^\/tests(\/.*)?$/];

type PathMatcher = string | RegExp;

function isRouteMatcher(
  req: NextRequest,
  allowedRoutes: PathMatcher[]
): boolean {
  const currentPath = req.nextUrl.pathname;
  return allowedRoutes.some((route) =>
    typeof route === 'string' ? currentPath === route : route.test(currentPath)
  );
}

function getSafeCallbackUrl(url: URL): string | null {
  const callbackUrl = url.searchParams.get('callbackUrl');
  return callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : null;
}

export default async function middleware(req: NextRequest) {
  const auth = await (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const url = req.nextUrl;
  const currentPath = url.pathname + url.search;
  const callbackUrl = getSafeCallbackUrl(url);
  const finalCallbackUrl = callbackUrl || currentPath;

  const isCallbackAuthRoute = (authRoutes as string[]).includes(
    finalCallbackUrl
  );

  if (auth && isRouteMatcher(req, authRoutes)) {
    const redirectTo = !isCallbackAuthRoute
      ? finalCallbackUrl
      : APP_ROUTES.HOME;
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  if (!auth && isRouteMatcher(req, protectedRoutes)) {
    const loginUrl = new URL(APP_ROUTES.AUTH.LOGIN, req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', finalCallbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons/.*|images/.*|puzzle-model/.*).*)',
  ],
};
