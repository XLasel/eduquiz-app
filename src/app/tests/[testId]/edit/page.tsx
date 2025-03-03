'use client';

import {
  startTestDeletion,
  startTestUpdate,
} from '@/redux/actions/testActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectCurrentTest,
  selectIsNotEmptyCurrentTest,
  selectIsTestsSkeletonVisible,
} from '@/redux/selectors/testSelectors';

import { TestFormValue } from '@/schemas/test';

import { IsAdmin } from '@/components/logic';

import { APP_ROUTES, OperationTypes, TEST_ENTITY } from '@/constants';
import { useHandleTestStatus } from '@/hooks';

import { SkeletonTestDesignerForm, TestDesignerForm } from '../../_components';
import Loading from '../../loading';

const EditTest = () => {
  const dispatch = useAppDispatch();

  const test = useAppSelector(selectCurrentTest);
  const isTestSkeletonVisible = useAppSelector(selectIsTestsSkeletonVisible);
  const isNotEmptyCurrentTest = useAppSelector(selectIsNotEmptyCurrentTest);

  useHandleTestStatus({
    entity: TEST_ENTITY.TEST,
    operation: OperationTypes.UPDATE,
    redirectUrl: APP_ROUTES.TESTS.LIST,
  });

  const onSave = (testData: TestFormValue) => {
    if (!test) return;
    dispatch(startTestUpdate({ updatedTest: testData, originalTest: test }));
  };

  const onDelete = () => {
    if (!test) return;
    dispatch(startTestDeletion(test.id));
  };

  return (
    <>
      {isTestSkeletonVisible && <SkeletonTestDesignerForm />}
      {isNotEmptyCurrentTest && (
        <TestDesignerForm
          initialData={test!}
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default IsAdmin(EditTest, {
  LoadingComponent: Loading,
});
