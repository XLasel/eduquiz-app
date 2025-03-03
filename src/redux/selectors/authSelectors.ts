import { createSelector } from '@reduxjs/toolkit';

import { REQUEST_STATUS } from '@/constants';

import { RootState } from '../store';

export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectCurrentUser = (state: RootState) => state.auth.user;

export const selectIsAuthLoading = createSelector(
  [selectAuthStatus],
  (status) => status.type === REQUEST_STATUS.PENDING
);

export const selectIsSkeletonVisible = createSelector(
  [selectAuthStatus, selectIsAuthLoading],
  (status, isPending) =>
    status.type === REQUEST_STATUS.INITIALIZING || isPending
);

export const selectIsUnauthenticated = createSelector(
  [selectIsSkeletonVisible, selectCurrentUser],
  (showSkeleton, user) => !showSkeleton && !user
);

export const selectIsAuthenticated = createSelector(
  [selectIsSkeletonVisible, selectCurrentUser],
  (showSkeleton, user) => !showSkeleton && Boolean(user)
);

export const selectIsAdmin = createSelector(
  [selectCurrentUser],
  (user) => user?.is_admin || false
);

export const selectAuthStateError = createSelector(
  [selectAuthStatus],
  (status) => {
    if (status.type === REQUEST_STATUS.ERROR) {
      return {
        code: status.code,
        message: status.message,
      };
    }
    return null;
  }
);
