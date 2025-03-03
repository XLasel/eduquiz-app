import {
  getSessionCookieHeader,
  handleApiRequest,
  unauthorizedResponse,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

export async function GET() {
  const sessionCookie = await getSessionCookieHeader();

  if (!sessionCookie) {
    return unauthorizedResponse();
  }
  return handleApiRequest(() =>
    apiServer.get('/users/current', {
      headers: sessionCookie,
    })
  );
}
