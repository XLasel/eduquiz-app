import { SignInValues, SignUpValues, User } from '@/schemas/auth';

export type SignInPayload = SignInValues;
export type SignInData = User;
export type SignUpPayload = SignUpValues;
export type SignUpData = User;
export type FetchCurrentUserData = User;
export type LogOutData = { success: boolean };
