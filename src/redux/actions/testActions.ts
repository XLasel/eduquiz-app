import { createAction } from '@reduxjs/toolkit';

import {
  CompleteAnswerCreationData,
  CompleteAnswerDeletionData,
  CompleteQuestionCreationData,
  CompleteQuestionDeletionData,
  CompleteQuestionUpdateData,
  CompleteTestCreationData,
  CompleteTestTitleUpdateData,
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
  StartTestUpdatePayload,
} from '@/types/tests';

export const startTestListFetch = createAction<
  Partial<StartTestListFetchPayload>
>('test/startTestListFetch');
export const startTestFetch = createAction<StartTestFetchPayload>(
  'test/startTestFetch'
);
export const startTestCreation = createAction<StartTestCreationPayload>(
  'test/startTestCreation'
);
export const completeTestCreation = createAction<CompleteTestCreationData>(
  'test/completeTestCreation'
);
export const startTestUpdate = createAction<StartTestUpdatePayload>(
  'test/startTestUpdate'
);
export const startTestDeletion = createAction<StartTestDeletionPayload>(
  'test/startTestDeletion'
);
export const startTestTitleUpdate = createAction<StartTestTitleUpdatePayload>(
  'test/startTestTitleUpdate'
);
export const completeTestTitleUpdate =
  createAction<CompleteTestTitleUpdateData>('test/completeTestTitleUpdate');
export const startQuestionCreation = createAction<StartQuestionCreationPayload>(
  'test/startQuestionCreation'
);
export const completeQuestionCreation =
  createAction<CompleteQuestionCreationData>('test/completeQuestionCreation');
export const startQuestionUpdate = createAction<StartQuestionUpdatePayload>(
  'test/startQuestionUpdate'
);
export const completeQuestionUpdate = createAction<CompleteQuestionUpdateData>(
  'test/completeQuestionUpdate'
);
export const startQuestionDeletion = createAction<StartQuestionDeletionPayload>(
  'test/startQuestionDeletion'
);
export const completeQuestionDeletion =
  createAction<CompleteQuestionDeletionData>('test/completeQuestionDeletion');
export const startAnswerCreation = createAction<StartAnswerCreationPayload>(
  'test/startAnswerCreation'
);
export const completeAnswerCreation = createAction<CompleteAnswerCreationData>(
  'test/completeAnswerCreation'
);
export const startAnswerUpdate = createAction<StartAnswerUpdatePayload>(
  'test/startAnswerUpdate'
);
export const completeAnswerUpdate = createAction('test/completeAnswerUpdate');
export const startAnswerMove = createAction<StartAnswerMovePayload>(
  'test/startAnswerMove'
);
export const completeAnswerMove = createAction('test/completeAnswerMove');
export const startAnswerDeletion = createAction<StartAnswerDeletionPayload>(
  'test/startAnswerDeletion'
);
export const completeAnswerDeletion = createAction<CompleteAnswerDeletionData>(
  'test/completeAnswerDeletion'
);
