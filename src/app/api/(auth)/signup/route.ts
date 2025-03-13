import { NextResponse } from 'next/server';

import type { AxiosResponse } from 'axios';
import { compare } from 'bcryptjs';

import { getErrorMessage } from '@/lib/utils';
import {
  createSession,
  getSessionId,
  handleApiRequest,
} from '@/services/handlers';
import { apiServer } from '@/services/instance';

import { SignUpData, SignUpPayload } from '@/types/auth';

export async function POST(request: Request) {
  const signUpData: SignUpPayload = await request.json();

  if (signUpData.is_admin) {
    const isValidAdminCode = await compare(
      signUpData.admin_code || '',
      process.env.ADMIN_CODE || ''
    );

    if (!isValidAdminCode) {
      return NextResponse.json(
        { error: getErrorMessage(403, 'user') },
        { status: 403 }
      );
    }
  }

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
