'use client';

import { startTestCreation } from '@/redux/actions/testActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsTestStateLoading } from '@/redux/selectors/testSelectors';

import { TestFormValue } from '@/schemas/test';

import { IsAdmin } from '@/components/logic';

import { APP_ROUTES, OperationTypes, TEST_ENTITY } from '@/constants';
import { useHandleTestStatus } from '@/hooks';

import { TestDesignerForm } from '../_components';
import Loading from '../loading';

const CreateTest = () => {
  const dispatch = useAppDispatch();

  useHandleTestStatus({
    entity: TEST_ENTITY.TEST,
    operation: OperationTypes.CREATE,
    redirectUrl: APP_ROUTES.TESTS.LIST,
  });

  const isSubmitting = useAppSelector(selectIsTestStateLoading);

  const onSave = (data: TestFormValue) => {
    dispatch(startTestCreation(data));
  };

  return <TestDesignerForm onSave={onSave} isSubmitting={isSubmitting} />;
};

export default IsAdmin(CreateTest, {
  LoadingComponent: Loading,
});
