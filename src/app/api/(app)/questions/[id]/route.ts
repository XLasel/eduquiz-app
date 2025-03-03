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
  const { id } = await params;
  const data = await request.json();
  const sessionCookie = await getSessionCookieHeader();

  if (!sessionCookie) {
    return unauthorizedResponse();
  }

  return handleApiRequest(() =>
    apiServer.patch(`/questions/${id}`, data, {
      headers: sessionCookie,
    })
  );
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sessionCookie = await getSessionCookieHeader();

  if (!sessionCookie) {
    return unauthorizedResponse();
  }

  return handleApiRequest(() =>
    apiServer.delete(`/questions/${id}`, {
      headers: sessionCookie,
    })
  );
}
