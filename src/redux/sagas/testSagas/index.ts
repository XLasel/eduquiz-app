import { all } from 'redux-saga/effects';

import watchAnswerActions from './answerSagas';
import watchQuestionActions from './questionSagas';
import watchTestActions from './testSagas';

export default function* watchTestRelatedActions() {
  yield all([watchTestActions(), watchQuestionActions(), watchAnswerActions()]);
}
