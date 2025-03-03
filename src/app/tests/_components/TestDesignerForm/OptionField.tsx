import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useMeasure from 'react-use-measure';

import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
} from 'framer-motion';
import { GripVertical, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/shadcnUi/button';
import { Checkbox } from '@/components/shadcnUi/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/shadcnUi/form';
import { Input } from '@/components/shadcnUi/input';

export const OptionField = ({
  orderValue,
  index,
  onDelete,
  totalFields,
}: {
  orderValue: string;
  index: number;
  onDelete: (id: number) => void;
  totalFields: number;
}) => {
  const { control, trigger, formState } = useFormContext();
  const controls = useDragControls();
  const [errorMessageRef, { height: errorMessageHeight }] = useMeasure();
  const [dragStarted, setDragStarted] = useState(false);

  const handleDragStart = (e: React.PointerEvent<SVGSVGElement>) => {
    setDragStarted(true);
    controls.start(e);
    window.addEventListener('pointerup', handleDragEnd);
  };

  const handleDragEnd = () => {
    setDragStarted(false);
    window.removeEventListener('pointerup', handleDragEnd);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('pointerup', handleDragEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Reorder.Item
      layout="position"
      value={orderValue}
      style={{
        position: 'relative',
        width: '100%',
      }}
      initial={{ opacity: 0, y: 20 }}
      dragListener={false}
      dragControls={controls}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.5 } }}
    >
      <div className="flex flex-col space-y-1">
        <div
          className={cn(
            'relative flex h-11 min-w-0 select-none items-center gap-2 py-1',
            dragStarted && 'cursor-grabbing'
          )}
        >
          <GripVertical
            className={cn(
              'h-5 w-5 shrink-0 text-gray-500',
              !dragStarted && totalFields > 1 ? 'cursor-grab' : ''
            )}
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => {
              if (totalFields > 1) {
                handleDragStart(e);
              }
            }}
            onPointerUp={() => {
              if (totalFields > 1) {
                handleDragEnd();
              }
            }}
          />
          <span className="w-6 shrink-0 text-sm text-gray-500">
            {index + 1}.
          </span>
          <FormField
            control={control}
            name={`answers.${index}.text`}
            render={({ field }) => (
              <FormItem className="min-w-0 flex-1">
                <FormControl>
                  <Input
                    placeholder={`Вариант ответа №${index + 1}`}
                    className="w-full bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage ref={errorMessageRef} className="absolute" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`answers.${index}.is_right`}
            render={({ field }) => (
              <Checkbox
                className="shrink-0"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (formState.isSubmitted) {
                    trigger('answers.root');
                  }
                }}
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => onDelete(index)}
            disabled={totalFields === 1}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <AnimatePresence>
          {errorMessageHeight > 0 && (
            <motion.div
              className="relative overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: errorMessageHeight, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ height: errorMessageHeight || 'auto' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reorder.Item>
  );
};
