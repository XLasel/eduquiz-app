import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, take, takeLatest } from 'redux-saga/effects';

import {
  completeAnswerCreation,
  completeAnswerDeletion,
  completeAnswerMove,
  completeAnswerUpdate,
  startAnswerCreation,
  startAnswerDeletion,
  startAnswerMove,
  startAnswerUpdate,
} from '@/redux/actions/testActions';
import { setError, setPending } from '@/redux/slices/testSlice';
import { answerApi } from '@/services/instance';

import {
  Answer,
  AnswerFormValue,
  Question,
  QuestionFormValue,
} from '@/schemas/test';
import {
  CompleteAnswerCreationData,
  CompleteAnswerDeletionData,
  CompleteAnswerMoveData,
  CompleteAnswerUpdateData,
  StartAnswerCreationPayload,
  StartAnswerDeletionPayload,
  StartAnswerMovePayload,
  StartAnswerUpdatePayload,
} from '@/types/tests';

import { TEST_ENTITY } from '@/constants';

import { createSagaWrapper } from '../common';

function* createAnswerSaga(action: PayloadAction<StartAnswerCreationPayload>) {
  yield* createSagaWrapper<
    StartAnswerCreationPayload,
    CompleteAnswerCreationData,
    typeof answerApi.create
  >({
    entity: TEST_ENTITY.ANSWER,
    api: answerApi.create,
    payload: action.payload,
    setPending,
    setError,
    handleDataWithPayload: completeAnswerCreation,
  });
}

function* deleteAnswerSaga(action: PayloadAction<StartAnswerDeletionPayload>) {
  yield* createSagaWrapper<
    StartAnswerDeletionPayload,
    CompleteAnswerDeletionData,
    typeof answerApi.delete
  >({
    entity: TEST_ENTITY.ANSWER,
    api: answerApi.delete,
    payload: action.payload,
    setPending,
    setError,
    successCallback: function* () {
      yield put(completeAnswerDeletion(action.payload));
    },
  });
}

function* updateAnswerSaga(action: PayloadAction<StartAnswerUpdatePayload>) {
  yield* createSagaWrapper<
    StartAnswerUpdatePayload,
    CompleteAnswerUpdateData,
    typeof answerApi.update
  >({
    entity: TEST_ENTITY.ANSWER,
    api: answerApi.update,
    payload: action.payload,
    setPending,
    setError,
    handleDataWithoutPayload: completeAnswerUpdate,
  });
}

function* moveAnswerSaga(action: PayloadAction<StartAnswerMovePayload>) {
  yield* createSagaWrapper<
    StartAnswerMovePayload,
    CompleteAnswerMoveData,
    typeof answerApi.move
  >({
    entity: TEST_ENTITY.ANSWER,
    api: answerApi.move,
    payload: action.payload,
    setPending,
    setError,
    handleDataWithoutPayload: completeAnswerMove,
  });
}

export function* checkAnswersForQuestions(
  currentQuestions: QuestionFormValue[],
  originalQuestions: Question[]
) {
  for (const currentQuestion of currentQuestions) {
    const originalQuestion = originalQuestions.find(
      (q) => q.id === currentQuestion.id
    );
    if (originalQuestion) {
      yield call(
        checkAnswersSaga,
        originalQuestion.id,
        originalQuestion.answers,
        currentQuestion.answers
      );
    }
  }
}

export function* checkAnswersSaga(
  questionId: number,
  originalAnswers: Answer[],
  currentAnswers: AnswerFormValue[]
) {
  const currentAnswersWithId = enrichAnswersWithIds(currentAnswers);
  const originalIds = new Set(originalAnswers.map((a) => a.id));
  const currentIds = new Set(currentAnswersWithId.map((a) => a.id));

  const toDelete = getAnswersToDelete(originalAnswers, currentIds);
  const toAdd = getAnswersToAdd(currentAnswersWithId, originalIds);

  yield* handleAnswerDeletions(toDelete);
  yield* handleAnswerAdditions(questionId, toAdd);
  yield* handleAnswerMoves(originalAnswers, currentAnswersWithId);
  yield* handleAnswerUpdates(originalAnswers, currentAnswersWithId);
}

function enrichAnswersWithIds(answers: AnswerFormValue[]) {
  return answers.map((answer) => ({
    ...answer,
    id: answer.id ?? Date.now() + Math.random(),
  }));
}

function getAnswersToDelete(
  originalAnswers: Answer[],
  currentIds: Set<number>
) {
  return originalAnswers.filter((answer) => !currentIds.has(answer.id));
}

function getAnswersToAdd(
  currentAnswersWithId: (AnswerFormValue & { id: number })[],
  originalIds: Set<number>
) {
  return currentAnswersWithId.filter((answer) => !originalIds.has(answer.id));
}

function* handleAnswerDeletions(toDelete: Answer[]) {
  for (const answer of toDelete) {
    yield put(startAnswerDeletion(answer.id));
    yield take(completeAnswerDeletion);
  }
}

function* handleAnswerAdditions(questionId: number, toAdd: AnswerFormValue[]) {
  for (const answer of toAdd) {
    yield put(startAnswerCreation({ questionId, answer }));
    yield take(completeAnswerCreation);
  }
}

function* handleAnswerMoves(
  originalAnswers: Answer[],
  currentAnswersWithId: (AnswerFormValue & { id: number })[]
) {
  const toMove = currentAnswersWithId.filter((answer, newIndex) => {
    const originalIndex = originalAnswers.findIndex((a) => a.id === answer.id);
    return originalIndex !== -1 && originalIndex !== newIndex;
  });

  for (const answer of toMove) {
    const newIndex = currentAnswersWithId.indexOf(answer);
    yield put(startAnswerMove({ id: answer.id, to: newIndex }));
    yield take(completeAnswerMove);
  }
}

function* handleAnswerUpdates(
  originalAnswers: Answer[],
  currentAnswersWithId: (AnswerFormValue & { id: number })[]
) {
  const toUpdate = currentAnswersWithId.filter((currentAnswer) => {
    const originalAnswer = originalAnswers.find(
      (a) => a.id === currentAnswer.id
    );
    return (
      originalAnswer &&
      (originalAnswer.text !== currentAnswer.text ||
        originalAnswer.is_right !== currentAnswer.is_right)
    );
  });

  for (const answer of toUpdate) {
    yield put(startAnswerUpdate(answer));
    yield take(completeAnswerUpdate);
  }
}

export default function* watchAnswerActions() {
  yield takeLatest(startAnswerCreation, createAnswerSaga);
  yield takeLatest(startAnswerMove, moveAnswerSaga);
  yield takeLatest(startAnswerUpdate, updateAnswerSaga);
  yield takeLatest(startAnswerDeletion, deleteAnswerSaga);
}
