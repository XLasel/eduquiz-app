import { PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';

import { authApi } from '@/services/instance';

import { userSchema } from '@/schemas/auth';
import {
  FetchCurrentUserData,
  LogOutData,
  SignInData,
  SignInPayload,
  SignUpData,
  SignUpPayload,
} from '@/types/auth';

import { AUTH_ENTITY } from '@/constants';

import {
  fetchCurrentUserRequest,
  logOutRequest,
  signInRequest,
  signUpRequest,
} from '../actions/authActions';
import {
  fetchCurrentUserSuccess,
  logOutSuccess,
  setError,
  setPending,
  setSuccess,
  setSuccessWithPayload,
  signInSuccess,
  signUpSuccess,
} from '../slices/authSlice';
import { createSagaWrapper } from './common';

const authOperations = {
  signUp: function* (action: PayloadAction<SignUpPayload>) {
    yield createSagaWrapper<SignUpPayload, SignUpData, typeof authApi.signUp>({
      entity: AUTH_ENTITY.USER,
      api: authApi.signUp,
      payload: action.payload,
      schema: userSchema,
      setPending,
      errorCallback: function* (error) {
        if (error.status === 400) {
          const errorMessages = Object.entries(
            error.data as Record<string, string[]>
          )
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join(', ');
          yield put(
            setError({
              code: 400,
              entity: AUTH_ENTITY.USER,
              message: errorMessages,
            })
          );
        } else {
          yield put(setError({ code: error.status, entity: AUTH_ENTITY.USER }));
        }
      },
      handleDataWithPayload: signUpSuccess,
      successCallback: function* () {
        yield put(setSuccessWithPayload({ operation: 'signUp' }));
      },
    });
  },
  signIn: function* (action: PayloadAction<SignInPayload>) {
    yield createSagaWrapper<SignInPayload, SignInData, typeof authApi.signIn>({
      entity: AUTH_ENTITY.SESSION,
      api: authApi.signIn,
      payload: action.payload,
      schema: userSchema,
      setPending,
      setError,
      handleDataWithPayload: signInSuccess,
      successCallback: function* () {
        yield put(setSuccessWithPayload({ operation: 'signIn' }));
      },
    });
  },
  fetchCurrentUser: function* () {
    yield createSagaWrapper<
      void,
      FetchCurrentUserData,
      typeof authApi.fetchUser
    >({
      entity: AUTH_ENTITY.USER,
      api: authApi.fetchUser,
      schema: userSchema,
      setPending,
      setSuccess,
      setError,
      handleDataWithPayload: fetchCurrentUserSuccess,
    });
  },
  logOut: function* () {
    yield createSagaWrapper<void, LogOutData, typeof authApi.logout>({
      entity: AUTH_ENTITY.USER,
      api: authApi.logout,
      setPending,
      setError,
      handleDataWithoutPayload: logOutSuccess,
      successCallback: function* () {
        yield put(setSuccessWithPayload({ operation: 'logOut' }));
      },
    });
  },
};

export default function* watchAuthActions() {
  yield takeLatest(signUpRequest, authOperations.signUp);
  yield takeLatest(signInRequest, authOperations.signIn);
  yield takeLatest(fetchCurrentUserRequest, authOperations.fetchCurrentUser);
  yield takeLatest(logOutRequest, authOperations.logOut);
}
