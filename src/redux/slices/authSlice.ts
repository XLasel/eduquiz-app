import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getAuthSuccessMessage, getErrorMessage } from '@/lib/utils';

import { User } from '@/schemas/auth';
import { SignInData, SignUpData } from '@/types/auth';

import { REQUEST_STATUS, RequestStatus } from '@/constants';

interface AuthState {
  user: User | null;
  status: {
    type: RequestStatus;
    message: string | null;
    code: number | null;
    operation: string | null;
  };
}

const initialState: AuthState = {
  user: null,
  status: {
    type: REQUEST_STATUS.INITIALIZING,
    message: null,
    code: null,
    operation: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPending: (state) => {
      state.status = {
        type: REQUEST_STATUS.PENDING,
        message: null,
        code: null,
        operation: null,
      };
    },
    setSuccess: (state) => {
      state.status = {
        type: REQUEST_STATUS.SUCCESS,
        message: getAuthSuccessMessage(),
        code: 200,
        operation: null,
      };
    },
    setSuccessWithPayload: (
      state,
      action: PayloadAction<{ operation: string }>
    ) => {
      state.status = {
        type: REQUEST_STATUS.SUCCESS,
        message: getAuthSuccessMessage(action.payload.operation),
        code: 200,
        operation: action.payload.operation,
      };
    },
    setError: (
      state,
      action: PayloadAction<{ code: number; entity: string; message?: string }>
    ) => {
      state.status = {
        type: REQUEST_STATUS.ERROR,
        message:
          action.payload.message ||
          getErrorMessage(action.payload.code, action.payload.entity),
        code: action.payload.code,
        operation: null,
      };
    },
    clearStatus: (state) => {
      state.status = {
        type: REQUEST_STATUS.IDLE,
        message: null,
        code: null,
        operation: null,
      };
    },
    signInSuccess: (state, action: PayloadAction<SignInData>) => {
      state.user = action.payload;
    },

    signUpSuccess: (state, action: PayloadAction<SignUpData>) => {
      state.user = action.payload;
    },

    fetchCurrentUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    logOutSuccess: (state) => {
      state.user = null;
    },
  },
});

export const {
  setPending,
  setSuccess,
  setSuccessWithPayload,
  setError,
  clearStatus,
  signInSuccess,
  signUpSuccess,
  fetchCurrentUserSuccess,
  logOutSuccess,
} = authSlice.actions;

export default authSlice.reducer;
