import type { AxiosResponse } from 'axios';

import {
  createSession,
  getSessionId,
  handleApiRequest,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

import { SignUpData, SignUpPayload } from '@/types/auth';

export async function POST(request: Request) {
  const signUpData: SignUpPayload = await request.json();

  return handleApiRequest(
    () => apiServer.post('/signup', signUpData),
    async (response: AxiosResponse<SignUpData>) => {
      const sessionId = getSessionId(response);
      if (sessionId) {
        await createSession(sessionId);
      }
    }
  );
}
