import { createAction } from '@reduxjs/toolkit';

import { SignInPayload, SignUpPayload } from '@/types/auth';

export const signInRequest = createAction<SignInPayload>('auth/signInRequest');
export const signUpRequest = createAction<SignUpPayload>('auth/signUpRequest');
export const fetchCurrentUserRequest = createAction(
  'auth/fetchCurrentUserRequest'
);
export const logOutRequest = createAction('auth/logOutRequest');
