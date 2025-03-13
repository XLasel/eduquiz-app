import { z } from 'zod';

import { MakePropertyRequired } from '@/lib/utils';

import { SearchParams } from '@/schemas/search';
import {
  Answer,
  answerCreatedServerSchema,
  AnswerFormValue,
  answerUpdatedServerSchema,
  Question,
  questionCreatedServerSchema,
  QuestionFormValue,
  questionUpdatedServerSchema,
  Test,
  testByIdServerSchema,
  testCreatedServerSchema,
  TestFormValue,
  testsListServerSchema,
  testUpdatedServerSchema,
} from '@/schemas/test';

// Tests list
export type StartTestListFetchPayload = SearchParams;
export type CompleteTestListFetchData = z.infer<typeof testsListServerSchema>;

// Specific test
export type StartTestFetchPayload = Test['id'];
export type CompleteTestFetchData = z.infer<typeof testByIdServerSchema>;

// Create test
export type StartTestCreationPayload = TestFormValue;
export type CompleteTestCreationData = z.infer<typeof testCreatedServerSchema>;

// Update test
export type StartTestUpdatePayload = {
  updatedTest: TestFormValue;
  originalTest: Test;
};
export type StartTestTitleUpdatePayload = Pick<Test, 'id'> & { title: string };
export type CompleteTestTitleUpdateData = z.infer<
  typeof testUpdatedServerSchema
>;

// Delete test
export type StartTestDeletionPayload = Test['id'];
export type CompleteTestDeletionData = StartTestDeletionPayload;

// Question
export type StartQuestionCreationPayload = {
  testId: Test['id'];
  question: QuestionFormValue;
};
export type CompleteQuestionCreationData = z.infer<
  typeof questionCreatedServerSchema
>;

export type StartQuestionUpdatePayload = MakePropertyRequired<
  QuestionFormValue,
  'id'
>;
export type CompleteQuestionUpdateData = z.infer<
  typeof questionUpdatedServerSchema
>;

export type StartQuestionDeletionPayload = Question['id'];
export type CompleteQuestionDeletionData = StartQuestionDeletionPayload;

// Answer
export type StartAnswerCreationPayload = {
  questionId: Question['id'];
  answer: AnswerFormValue;
};
export type CompleteAnswerCreationData = z.infer<
  typeof answerCreatedServerSchema
>;

export type StartAnswerUpdatePayload = MakePropertyRequired<
  AnswerFormValue,
  'id'
>;
export type CompleteAnswerUpdateData = z.infer<
  typeof answerUpdatedServerSchema
>;

export type StartAnswerMovePayload = {
  id: Answer['id'];
  to: number;
};
export type CompleteAnswerMoveData = { status: 'ok' };

export type StartAnswerDeletionPayload = Answer['id'];
export type CompleteAnswerDeletionData = StartAnswerDeletionPayload;
