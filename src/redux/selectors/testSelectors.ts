import { createSelector } from '@reduxjs/toolkit';

import { REQUEST_STATUS } from '@/constants';

import { RootState } from '../store';

export const selectTestStateStatus = (state: RootState) => state.tests.status;
export const selectCurrentTest = (state: RootState) =>
  state.tests.currentTest.test;
export const selectCurrentTestIsStale = (state: RootState) =>
  state.tests.currentTest.isStale;
export const selectTests = (state: RootState) => state.tests.tests;
export const selectTestsListIsStale = (state: RootState) =>
  state.tests.tests.isStale;

export const selectIsTestStateLoading = createSelector(
  selectTestStateStatus,
  (status) =>
    status.type === REQUEST_STATUS.INITIALIZING ||
    status.type === REQUEST_STATUS.PENDING
);

export const selectShowCurrentTestSkeleton = createSelector(
  [selectTestStateStatus, selectCurrentTest, selectCurrentTestIsStale],
  (status, test, isStale) => {
    return (
      status.type === REQUEST_STATUS.INITIALIZING ||
      (status.type === REQUEST_STATUS.PENDING &&
        (!Boolean(test) || isStale === null))
    );
  }
);

export const selectShowTestForm = createSelector(
  [selectShowCurrentTestSkeleton, selectCurrentTest],
  (showSkeleton, test) => {
    return !showSkeleton && Boolean(test);
  }
);

export const selectIsEmptyTestList = createSelector(
  [selectIsTestStateLoading, selectTests],
  (isLoading, tests) => !isLoading && !Boolean(tests.list.length)
);

export const selectTestStateError = createSelector(
  selectTestStateStatus,
  (status) =>
    status.type === REQUEST_STATUS.ERROR
      ? { code: status.code, message: status.message }
      : null
);

export const selectIsCurrentTestSubmitting = createSelector(
  [selectTestStateStatus, selectCurrentTest],
  (status, test) => {
    return status.type === REQUEST_STATUS.PENDING && Boolean(test);
  }
);
