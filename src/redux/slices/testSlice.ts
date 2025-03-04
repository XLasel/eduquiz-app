import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getErrorMessage, getTestSuccessMessage } from '@/lib/utils';

import { Test } from '@/schemas/test';
import {
  CompleteTestDeletionData,
  CompleteTestFetchData,
  CompleteTestListFetchData,
} from '@/types/tests';

import { REQUEST_STATUS, RequestStatus } from '@/constants';

interface TestsState {
  tests: {
    list: Test[];
    isStale: boolean | null;
    key: string | null;
    pagination: {
      total_pages: number;
      total_count: number;
    };
  };
  currentTest: { test: Test | null; isStale: boolean | null };
  status: {
    type: RequestStatus;
    message: string | null;
    code: number | null;
    operation: string | null;
  };
}

const initialState: TestsState = {
  tests: {
    list: [],
    isStale: null,
    key: null,
    pagination: {
      total_pages: 0,
      total_count: 0,
    },
  },
  currentTest: {
    test: null,
    isStale: null,
  },
  status: {
    type: REQUEST_STATUS.INITIALIZING,
    message: null,
    code: null,
    operation: null,
  },
};

const testSlice = createSlice({
  name: 'test',
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
        message: getTestSuccessMessage(),
        code: 200,
        operation: null,
      };
    },
    setSuccessWithPayload: (
      state,
      action: PayloadAction<{ entity: string; operation: string }>
    ) => {
      state.status = {
        type: REQUEST_STATUS.SUCCESS,
        message: getTestSuccessMessage(
          action.payload.entity,
          action.payload.operation
        ),
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
    markTestsListStale: (state) => {
      state.tests.isStale = true;
    },
    markTestStale: (state, action: PayloadAction<number>) => {
      if (state.currentTest.test?.id === action.payload) {
        state.currentTest.isStale = true;
      }
    },
    completeTestListFetch: (
      state,
      action: PayloadAction<{
        data: CompleteTestListFetchData;
        key: string;
      }>
    ) => {
      state.tests.list = action.payload.data.tests;
      state.tests.pagination = action.payload.data.meta;
      state.tests.key = action.payload.key;
      state.tests.isStale = false;
    },
    completeTestFetch: (
      state,
      action: PayloadAction<CompleteTestFetchData>
    ) => {
      state.currentTest.test = action.payload;
      state.currentTest.isStale = false;
    },
    completeTestUpdate: (state) => {
      state.currentTest.isStale = true;
      state.tests.isStale = true;
    },
    completeTestDeletion: (
      state,
      action: PayloadAction<CompleteTestDeletionData>
    ) => {
      if (state.currentTest?.test?.id === action.payload) {
        state.currentTest.test = null;
        state.currentTest.isStale = null;
      }
    },
  },
});

export const {
  completeTestUpdate,
  completeTestDeletion,
  completeTestListFetch,
  completeTestFetch,
  setPending,
  setError,
  setSuccess,
  setSuccessWithPayload,
  markTestsListStale,
  markTestStale,
} = testSlice.actions;

export default testSlice.reducer;
