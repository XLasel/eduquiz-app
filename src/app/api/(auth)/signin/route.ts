import type { AxiosResponse } from 'axios';

import {
  createSession,
  getSessionId,
  handleApiRequest,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

import { SignInData, SignInPayload } from '@/types/auth';

export async function POST(request: Request) {
  const userData: SignInPayload = await request.json();

  return handleApiRequest(
    () => apiServer.post('/signin', userData),
    async (response: AxiosResponse<SignInData>) => {
      const sessionId = getSessionId(response);
      if (sessionId) {
        await createSession(sessionId);
      }
    }
  );
}
