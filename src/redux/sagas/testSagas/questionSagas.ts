import { PayloadAction } from '@reduxjs/toolkit';
import { put, take, takeLatest } from 'redux-saga/effects';

import {
  completeAnswerCreation,
  completeQuestionCreation,
  completeQuestionDeletion,
  completeQuestionUpdate,
  startAnswerCreation,
  startQuestionCreation,
  startQuestionDeletion,
  startQuestionUpdate,
} from '@/redux/actions/testActions';
import { setError, setPending } from '@/redux/slices/testSlice';
import { questionApi } from '@/services/instance';

import {
  Question,
  questionCreatedServerSchema,
  QuestionFormValue,
} from '@/schemas/test';
import {
  CompleteQuestionCreationData,
  CompleteQuestionDeletionData,
  CompleteQuestionUpdateData,
  StartQuestionCreationPayload,
  StartQuestionDeletionPayload,
  StartQuestionUpdatePayload,
} from '@/types/tests';

import { TEST_ENTITY } from '@/constants';

import { createSagaWrapper } from '../common';
import { checkAnswersForQuestions } from './answerSagas';

function* createQuestionSaga(
  action: PayloadAction<StartQuestionCreationPayload>
) {
  yield* createSagaWrapper<
    StartQuestionCreationPayload,
    CompleteQuestionCreationData,
    typeof questionApi.create
  >({
    entity: TEST_ENTITY.QUESTION,
    api: questionApi.create,
    payload: action.payload,
    schema: questionCreatedServerSchema,
    setPending,
    setError,
    successCallback: function* (question) {
      for (const answer of action.payload.question.answers) {
        yield put(startAnswerCreation({ questionId: question.id, answer }));
        yield take(completeAnswerCreation.type);
      }
      yield put(completeQuestionCreation(question));
    },
  });
}

function* deleteQuestionSaga(
  action: PayloadAction<StartQuestionDeletionPayload>
) {
  yield* createSagaWrapper<
    StartQuestionDeletionPayload,
    CompleteQuestionDeletionData,
    typeof questionApi.delete
  >({
    entity: TEST_ENTITY.QUESTION,
    api: questionApi.delete,
    payload: action.payload,
    setPending,
    setError,
    successCallback: function* () {
      yield put(completeQuestionDeletion(action.payload));
    },
  });
}

function* updateQuestionSaga(
  action: PayloadAction<StartQuestionUpdatePayload>
) {
  yield* createSagaWrapper<
    StartQuestionUpdatePayload,
    CompleteQuestionUpdateData,
    typeof questionApi.update
  >({
    entity: TEST_ENTITY.QUESTION,
    api: questionApi.update,
    payload: action.payload,
    setPending,
    setError,
    handleDataWithPayload: completeQuestionUpdate,
  });
}

export function* checkQuestionsSaga(
  testId: number,
  currentQuestions: QuestionFormValue[],
  originalQuestions: Question[]
) {
  const questionIdsToRemove = getQuestionIdsToRemove(
    currentQuestions,
    originalQuestions
  );
  const questionsToAdd = getQuestionsToAdd(currentQuestions);
  const questionsToUpdate = getQuestionsToUpdate(
    currentQuestions,
    originalQuestions
  );

  yield* handleQuestionDeletions(questionIdsToRemove);
  yield* handleQuestionAdditions(testId, questionsToAdd);
  yield* handleQuestionUpdates(questionsToUpdate);
  yield* checkAnswersForQuestions(currentQuestions, originalQuestions);
}

function getQuestionIdsToRemove(
  currentQuestions: QuestionFormValue[],
  originalQuestions: Question[]
) {
  return originalQuestions
    .filter((q) => !currentQuestions.some((cq) => cq.id === q.id))
    .map((q) => q.id);
}

function getQuestionsToAdd(currentQuestions: QuestionFormValue[]) {
  return currentQuestions.filter((q) => q.id === undefined);
}

function getQuestionsToUpdate(
  currentQuestions: QuestionFormValue[],
  originalQuestions: Question[]
) {
  return currentQuestions
    .filter((q) => q.id !== undefined)
    .map((cq) => {
      const originalQuestion = originalQuestions.find((q) => q.id === cq.id);
      if (!originalQuestion) return null;

      const isQuestionChanged =
        originalQuestion.title !== cq.title ||
        originalQuestion.question_type !== cq.question_type ||
        originalQuestion.answer !== cq.answer;

      return isQuestionChanged ? { ...cq, id: cq.id! } : null;
    })
    .filter((q) => q !== null);
}

function* handleQuestionDeletions(questionIdsToRemove: number[]) {
  for (const id of questionIdsToRemove) {
    yield put(startQuestionDeletion(id));
    yield take(completeQuestionDeletion);
  }
}

function* handleQuestionAdditions(
  testId: number,
  questionsToAdd: QuestionFormValue[]
) {
  for (const question of questionsToAdd) {
    yield put(startQuestionCreation({ testId, question }));
    yield take(completeQuestionCreation);
  }
}

function* handleQuestionUpdates(
  questionsToUpdate: StartQuestionUpdatePayload[]
) {
  for (const update of questionsToUpdate) {
    yield put(startQuestionUpdate(update));
    yield take(completeQuestionUpdate);
  }
}

export default function* watchQuestionActions() {
  yield takeLatest(startQuestionCreation, createQuestionSaga);
  yield takeLatest(startQuestionUpdate, updateQuestionSaga);
  yield takeLatest(startQuestionDeletion, deleteQuestionSaga);
}
