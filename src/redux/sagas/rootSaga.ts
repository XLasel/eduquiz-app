import { all } from 'redux-saga/effects';

import watchAuthActions from './authSaga';
import watchTestRelatedActions from './testSagas';

export default function* rootSaga() {
  yield all([watchAuthActions(), watchTestRelatedActions()]);
}
