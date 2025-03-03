'use client';

import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { usePreviousRoutes } from '@/providers/RouteHistoryProvider';

import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { Button } from '@/components/shadcnUi/button';

import { APP_ROUTES, TESTS_LIST_ROUTE_PATTERN } from '@/constants';

export interface BackToTestButtonProps {
  handleExit?: () => void;
  requireConfirmation?: boolean;
  confirmTitle?: string;
  confirmMessage?: string;
}

export const BackToTestButton = ({
  handleExit,
  requireConfirmation = false,
  confirmTitle = 'Вернуться к списку тестов?',
  confirmMessage = 'Вы уверены, что хотите вернуться к списку тестов? Ваш прогресс будет сброшен.',
}: BackToTestButtonProps) => {
  const router = useRouter();
  const { lastRoute } = usePreviousRoutes();
  const [dialogOpen, setDialogOpen] = useState(false);

  const executeAction = useCallback(() => {
    if (handleExit) {
      handleExit();
    } else if (lastRoute && TESTS_LIST_ROUTE_PATTERN.test(lastRoute)) {
      router.back();
    } else {
      router.push(APP_ROUTES.TESTS.LIST);
    }
  }, [handleExit, lastRoute, router]);

  const onClickHandler = useCallback(
    () => (requireConfirmation ? setDialogOpen(true) : executeAction()),
    [executeAction, requireConfirmation]
  );

  return (
    <>
      <Button className="self-start" variant="outline" onClick={onClickHandler}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к тестам
      </Button>

      {requireConfirmation && (
        <ConfirmationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={confirmTitle}
          message={confirmMessage}
          onConfirm={executeAction}
        />
      )}
    </>
  );
};
