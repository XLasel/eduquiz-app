import { TestPageWrapper } from '../_components';

const CreateTestLayout = ({ children }: { children: React.ReactNode }) => {
  return <TestPageWrapper>{children}</TestPageWrapper>;
};

export default CreateTestLayout;
