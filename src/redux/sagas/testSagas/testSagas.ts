import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, take, takeLatest } from 'redux-saga/effects';

import {
  completeQuestionCreation,
  completeTestCreation,
  completeTestTitleUpdate,
  startQuestionCreation,
  startTestCreation,
  startTestDeletion,
  startTestFetch,
  startTestListFetch,
  startTestTitleUpdate,
  startTestUpdate,
} from '@/redux/actions/testActions';
import {
  completeTestDeletion,
  completeTestFetch,
  completeTestListFetch,
  completeTestUpdate,
  markTestsListStale,
  setError,
  setPending,
  setSuccess,
  setSuccessWithPayload,
} from '@/redux/slices/testSlice';
import { generateCacheKey } from '@/lib/utils';
import { testApi } from '@/services/instance';

import {
  testByIdServerSchema,
  testCreatedServerSchema,
  testsListServerSchema,
  testUpdatedServerSchema,
} from '@/schemas/test';
import {
  CompleteTestCreationData,
  CompleteTestDeletionData,
  CompleteTestFetchData,
  CompleteTestListFetchData,
  CompleteTestTitleUpdateData,
  StartTestCreationPayload,
  StartTestDeletionPayload,
  StartTestFetchPayload,
  StartTestListFetchPayload,
  StartTestTitleUpdatePayload,
  StartTestUpdatePayload,
} from '@/types/tests';

import { OperationTypes, TEST_ENTITY } from '@/constants';

import { createSagaWrapper } from '../common';
import { checkQuestionsSaga } from './questionSagas';

function* fetchTestListSaga(action: PayloadAction<StartTestListFetchPayload>) {
  yield* createSagaWrapper<
    StartTestListFetchPayload,
    CompleteTestListFetchData,
    typeof testApi.get
  >({
    entity: TEST_ENTITY.TEST,
    api: testApi.get,
    payload: action.payload,
    schema: testsListServerSchema,
    setPending,
    setSuccess,
    setError,
    successCallback: function* (data) {
      const cacheKeyString = generateCacheKey(action.payload);
      yield put(completeTestListFetch({ data, key: cacheKeyString }));
    },
  });
}

function* fetchTestSaga(action: PayloadAction<StartTestFetchPayload>) {
  yield* createSagaWrapper<
    StartTestFetchPayload,
    CompleteTestFetchData,
    typeof testApi.getById
  >({
    entity: TEST_ENTITY.TEST,
    api: testApi.getById,
    payload: action.payload as number,
    schema: testByIdServerSchema,
    setPending,
    setSuccess,
    setError,
    handleDataWithPayload: completeTestFetch,
  });
}

function* createTestSaga(action: PayloadAction<StartTestCreationPayload>) {
  yield* createSagaWrapper<
    StartTestCreationPayload,
    CompleteTestCreationData,
    typeof testApi.create
  >({
    entity: TEST_ENTITY.TEST,
    api: testApi.create,
    payload: action.payload,
    schema: testCreatedServerSchema,
    setPending,
    setError,
    handleDataWithPayload: completeTestCreation,
    successCallback: function* ({ id }) {
      for (const question of action.payload.questions) {
        yield put(startQuestionCreation({ testId: id, question: question }));
        yield take(completeQuestionCreation.type);
      }
      yield put(
        setSuccessWithPayload({
          entity: TEST_ENTITY.TEST,
          operation: OperationTypes.CREATE,
        })
      );
      yield put(markTestsListStale());
    },
  });
}

function* deleteTestSaga(action: PayloadAction<StartTestDeletionPayload>) {
  yield* createSagaWrapper<
    StartTestDeletionPayload,
    CompleteTestDeletionData,
    typeof testApi.delete
  >({
    entity: TEST_ENTITY.TEST,
    api: testApi.delete,
    payload: action.payload,
    setPending,
    setError,
    successCallback: function* () {
      yield put(completeTestDeletion(action.payload));
      yield put(
        setSuccessWithPayload({
          entity: TEST_ENTITY.TEST,
          operation: OperationTypes.DELETE,
        })
      );
      yield put(markTestsListStale());
    },
  });
}

function* updateTestTitleSaga(
  action: PayloadAction<StartTestTitleUpdatePayload>
) {
  yield* createSagaWrapper<
    StartTestTitleUpdatePayload,
    CompleteTestTitleUpdateData,
    typeof testApi.update
  >({
    entity: TEST_ENTITY.TEST,
    api: testApi.update,
    payload: action.payload,
    schema: testUpdatedServerSchema,
    setPending,
    setError,
    handleDataWithPayload: completeTestTitleUpdate,
  });
}

function* updateTestSaga(action: PayloadAction<StartTestUpdatePayload>) {
  yield put(setPending());
  const { updatedTest, originalTest } = action.payload;

  const isTitleChanged = originalTest?.title !== updatedTest.title;

  if (isTitleChanged) {
    yield put(
      startTestTitleUpdate({
        id: originalTest.id,
        title: updatedTest.title,
      })
    );
    yield take(completeTestTitleUpdate);
  }

  yield call(
    checkQuestionsSaga,
    originalTest.id,
    updatedTest.questions,
    originalTest.questions
  );

  yield put(completeTestUpdate());
  yield put(
    setSuccessWithPayload({
      entity: TEST_ENTITY.TEST,
      operation: OperationTypes.UPDATE,
    })
  );
}

export default function* watchTestActions() {
  yield takeLatest(startTestListFetch, fetchTestListSaga);
  yield takeLatest(startTestFetch, fetchTestSaga);
  yield takeLatest(startTestCreation, createTestSaga);
  yield takeLatest(startTestUpdate, updateTestSaga);
  yield takeLatest(startTestDeletion, deleteTestSaga);
  yield takeLatest(startTestTitleUpdate, updateTestTitleSaga);
}
