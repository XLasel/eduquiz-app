'use client';

import { use } from 'react';

import {
  startTestDeletion,
  startTestUpdate,
} from '@/redux/actions/testActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCurrentTest,
  selectIsCurrentTestSubmitting,
  selectShowCurrentTestSkeleton,
} from '@/redux/selectors/testSelectors';

import { TestFormValue } from '@/schemas/test';

import { IsAdmin } from '@/components/logic';

import { APP_ROUTES, OperationTypes, TEST_ENTITY } from '@/constants';
import { useHandleTestStatus } from '@/hooks';

import { SkeletonTestDesignerForm, TestDesignerForm } from '../../_components';
import Loading from '../../loading';

const EditTest = ({ params }: { params: Promise<{ testId: string }> }) => {
  const dispatch = useAppDispatch();
  const { testId } = use(params);

  const test = useAppSelector(selectCurrentTest);
  const showSkeleton = useAppSelector(selectShowCurrentTestSkeleton);
  const isSubmitting = useAppSelector(selectIsCurrentTestSubmitting);

  useHandleTestStatus({
    entity: TEST_ENTITY.TEST,
    operation: OperationTypes.UPDATE,
    redirectUrl: APP_ROUTES.TESTS.LIST,
  });

  const onSave = (testData: TestFormValue) => {
    if (!test) return;
    dispatch(startTestUpdate({ updatedTest: testData, originalTest: test }));
  };

  const onDelete = (testId: number) => {
    dispatch(startTestDeletion(testId));
  };

  return showSkeleton || Number(testId) !== test?.id ? (
    <SkeletonTestDesignerForm />
  ) : test ? (
    <TestDesignerForm
      initialData={test}
      onSave={onSave}
      onDelete={() => onDelete(test.id)}
      isSubmitting={isSubmitting}
    />
  ) : null;
};

export default IsAdmin(EditTest, {
  LoadingComponent: Loading,
});
