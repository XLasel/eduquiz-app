import {
  getSessionCookieHeader,
  handleApiRequest,
  unauthorizedResponse,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const answersData = await request.json();
  const sessionCookie = await getSessionCookieHeader();

  if (!sessionCookie) {
    return unauthorizedResponse();
  }

  return handleApiRequest(() =>
    apiServer.post(`/questions/${id}/answers`, answersData, {
      headers: sessionCookie,
    })
  );
}
