import { createSelector } from '@reduxjs/toolkit';

import { REQUEST_STATUS } from '@/constants';

import { RootState } from '../store';

export const selectTestStateStatus = (state: RootState) => state.tests.status;

export const selectCurrentTest = (state: RootState) =>
  state.tests.currentTest.test;

export const selectTests = (state: RootState) => state.tests.tests;

export const selectIsTestStateLoading = createSelector(
  selectTestStateStatus,
  (status) => status.type === REQUEST_STATUS.PENDING
);

export const selectIsTestsSkeletonVisible = createSelector(
  [selectTestStateStatus, selectIsTestStateLoading],
  (status, isPending) =>
    status.type === REQUEST_STATUS.INITIALIZING || isPending
);

export const selectIsEmptyTestList = createSelector(
  [selectIsTestsSkeletonVisible, selectTests],
  (showSkeleton, tests) => !showSkeleton && !Boolean(tests.list.length)
);

export const selectIsEmptyCurrentTest = createSelector(
  [selectIsTestsSkeletonVisible, selectCurrentTest],
  (showSkeleton, test) => !showSkeleton && !Boolean(test)
);

export const selectIsNotEmptyTestList = createSelector(
  [selectIsTestsSkeletonVisible, selectTests],
  (showSkeleton, tests) => !showSkeleton && Boolean(tests.list.length)
);

export const selectIsNotEmptyCurrentTest = createSelector(
  [selectIsTestsSkeletonVisible, selectCurrentTest],
  (showSkeleton, test) => !showSkeleton && Boolean(test)
);

export const selectTestStateError = createSelector(
  selectTestStateStatus,
  (status) =>
    status.type === REQUEST_STATUS.ERROR
      ? { code: status.code, message: status.message }
      : null
);
