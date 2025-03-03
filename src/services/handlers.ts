import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import axios, { AxiosResponse } from 'axios';

import { extractSessionId, getErrorMessage } from '@/lib/utils';

import { APP_ROUTES, SESSION_COOKIE_NAME } from '@/constants';

import 'server-only';

export async function handleApiRequest<T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  onSuccess?: (response: AxiosResponse<T>) => Promise<void>
): Promise<NextResponse> {
  try {
    const response = await apiCall();

    if (onSuccess) {
      await onSuccess(response);
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: getErrorMessage(500) }, { status: 500 });
  }
}

export const getSessionId = (response: AxiosResponse): string => {
  const setCookieHeader = response.headers['set-cookie']?.[0];
  return setCookieHeader ? extractSessionId(setCookieHeader) : '';
};

export const createSession = async (sessionId: string) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    path: APP_ROUTES.HOME,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });
};

export const getSessionCookieHeader = async () => {
  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME);

  if (!sessionId) return null;

  return {
    Cookie: `${sessionId.name}=${sessionId.value}`,
  };
};

export const unauthorizedResponse = () => {
  return NextResponse.json({ error: getErrorMessage(401) }, { status: 401 });
};
