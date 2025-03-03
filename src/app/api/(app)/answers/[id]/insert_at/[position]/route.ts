import {
  getSessionCookieHeader,
  handleApiRequest,
  unauthorizedResponse,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

export async function PATCH(
  _: Request,
  { params }: { params: Promise<{ id: string; position: string }> }
) {
  const sessionCookie = await getSessionCookieHeader();
  const { id, position } = await params;

  if (!sessionCookie) {
    return unauthorizedResponse();
  }

  return handleApiRequest(() =>
    apiServer.patch(`/answers/${id}/insert_at/${position}`, null, {
      headers: sessionCookie,
    })
  );
}
