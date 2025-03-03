import { cookies } from 'next/headers';

import { handleApiRequest } from '@/services/handlers';
import { apiServer } from '@/services/instance';

import { SESSION_COOKIE_NAME } from '@/constants';

export async function DELETE() {
  return handleApiRequest(
    () => apiServer.delete('/logout'),
    async () => {
      (await cookies()).delete(SESSION_COOKIE_NAME);
    }
  );
}
