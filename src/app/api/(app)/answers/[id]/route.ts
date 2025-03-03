import {
  getSessionCookieHeader,
  handleApiRequest,
  unauthorizedResponse,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const data = await request.json();
  const sessionCookie = await getSessionCookieHeader();
  const { id } = await params;

  if (!sessionCookie) {
    return unauthorizedResponse();
  }

  return handleApiRequest(() =>
    apiServer.patch(`/answers/${id}`, data, {
      headers: sessionCookie,
    })
  );
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionCookie = await getSessionCookieHeader();
  const { id } = await params;

  if (!sessionCookie) {
    return unauthorizedResponse();
  }

  return handleApiRequest(() =>
    apiServer.delete(`/answers/${id}`, {
      headers: sessionCookie,
    })
  );
}
