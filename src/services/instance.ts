import axios from 'axios';

import { SignInPayload, SignUpPayload } from '@/types/auth';
import {
  StartAnswerCreationPayload,
  StartAnswerDeletionPayload,
  StartAnswerMovePayload,
  StartAnswerUpdatePayload,
  StartQuestionCreationPayload,
  StartQuestionDeletionPayload,
  StartQuestionUpdatePayload,
  StartTestCreationPayload,
  StartTestDeletionPayload,
  StartTestFetchPayload,
  StartTestListFetchPayload,
  StartTestTitleUpdatePayload,
} from '@/types/tests';

export const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'scope-key': process.env.SCOPE_KEY,
  },
  withCredentials: true,
});

export const apiProxy = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

apiProxy.interceptors.response.use(
  (res) => res,
  (error) => error.response
);

export const authApi = {
  signIn: async ({ username, password }: SignInPayload) =>
    await apiProxy.post('/signin', { username, password }),
  signUp: async (data: SignUpPayload) => await apiProxy.post('/signup', data),
  fetchUser: async () => await apiProxy.get('/users/current'),
  logout: async () => await apiProxy.delete('/logout'),
};

export const testApi = {
  get: async (params: Partial<StartTestListFetchPayload>) =>
    await apiProxy.get('/tests', { params: params }),
  getById: async (id: StartTestFetchPayload) =>
    await apiProxy.get(`/tests/${id}`),
  create: async ({ title }: StartTestCreationPayload) =>
    await apiProxy.post('/tests', { title }),
  update: async ({ id, title }: StartTestTitleUpdatePayload) =>
    await apiProxy.patch(`/tests/${id}`, { title }),
  delete: async (id: StartTestDeletionPayload) =>
    await apiProxy.delete(`/tests/${id}`),
};

export const questionApi = {
  create: async ({
    testId,
    question: { title, question_type, answer },
  }: StartQuestionCreationPayload) =>
    await apiProxy.post(`/tests/${testId}/questions`, {
      title,
      question_type,
      answer,
    }),
  update: async ({
    id,
    title,
    question_type,
    answer,
  }: StartQuestionUpdatePayload) =>
    await apiProxy.patch(`/questions/${id}`, {
      title,
      question_type,
      answer,
    }),
  delete: async (id: StartQuestionDeletionPayload) =>
    await apiProxy.delete(`/questions/${id}`),
};

export const answerApi = {
  create: async ({ questionId, answer }: StartAnswerCreationPayload) =>
    await apiProxy.post(`/questions/${questionId}/answers`, {
      text: answer.text,
      is_right: answer.is_right,
    }),

  move: async ({ id, to }: StartAnswerMovePayload) =>
    await apiProxy.patch(`/answers/${id}/insert_at/${to + 1}`),
  update: async ({ id, text, is_right }: StartAnswerUpdatePayload) =>
    await apiProxy.patch(`/answers/${id}`, {
      text,
      is_right,
    }),
  delete: async (id: StartAnswerDeletionPayload) =>
    await apiProxy.delete(`/answers/${id}`),
};
