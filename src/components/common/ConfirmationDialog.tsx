import { Button } from '@/components/shadcnUi/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcnUi/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/shadcnUi/drawer';

import { useDeviceInfo } from '@/hooks';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmVariant?: 'destructive' | 'default' | 'brand';
}

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
  confirmVariant = 'default',
}: ConfirmationDialogProps) => {
  const { isMobile } = useDeviceInfo();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{message}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <Button variant={confirmVariant} onClick={onConfirm}>
              {confirmText}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel || (() => onOpenChange(false))}
            >
              {cancelText}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p>{message}</p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel || (() => onOpenChange(false))}
          >
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
