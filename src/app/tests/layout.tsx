import { BasePageContainer } from '@/components/common';

const TestsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BasePageContainer
      marginTop="withSpacing"
      marginBottom="withSpacing"
      padding="withSpacing"
      className="flex grow flex-col items-center"
    >
      {children}
    </BasePageContainer>
  );
};

export default TestsLayout;
