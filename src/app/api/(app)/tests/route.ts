import { type NextRequest } from 'next/server';

import {
  getSessionCookieHeader,
  handleApiRequest,
  unauthorizedResponse,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

export async function POST(request: Request) {
  const testData = await request.json();
  const sessionCookie = await getSessionCookieHeader();

  if (!sessionCookie) {
    return unauthorizedResponse();
  }

  return handleApiRequest(() =>
    apiServer.post('/tests', testData, {
      headers: sessionCookie,
    })
  );
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams.toString();
  const sessionCookie = await getSessionCookieHeader();

  if (!sessionCookie) {
    return unauthorizedResponse();
  }

  return handleApiRequest(() =>
    apiServer.get(`/tests?${searchParams}`, {
      headers: sessionCookie,
    })
  );
}
