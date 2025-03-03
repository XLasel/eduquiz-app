import {
  getSessionCookieHeader,
  handleApiRequest,
  unauthorizedResponse,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

import { TestFormValue } from '@/schemas/test';

export const dynamic = 'force-dynamic';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionCookie = await getSessionCookieHeader();
  const id = (await params).id;

  if (!sessionCookie) {
    return unauthorizedResponse();
  }
  return handleApiRequest(() =>
    apiServer.get(`/tests/${id}`, {
      headers: sessionCookie,
    })
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const data: Pick<TestFormValue, 'title'> = await request.json();
  const sessionCookie = await getSessionCookieHeader();
  const { id } = await params;

  if (!sessionCookie) {
    return unauthorizedResponse();
  }
  return handleApiRequest(() =>
    apiServer.patch(`/tests/${id}`, data, {
      headers: sessionCookie,
    })
  );
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionCookie = await getSessionCookieHeader();
  const id = (await params).id;

  if (!sessionCookie) {
    return unauthorizedResponse();
  }
  return handleApiRequest(() =>
    apiServer.delete(`/tests/${id}`, { headers: sessionCookie })
  );
}
