'use client';

import { memo, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, Reorder } from 'framer-motion';

import { onReorder } from '@/lib/utils';

import { questionFormSchema, QuestionFormValue } from '@/schemas/test';

import { ErrorMessage } from '@/components/common';
import { Button } from '@/components/shadcnUi/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcnUi/form';
import { Input } from '@/components/shadcnUi/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcnUi/select';

import { typesField } from '@/config';
import { EMPTY_OPTION } from '@/constants';

import { OptionField } from './OptionField';

interface QuestionFormProps {
  initialQuestion: QuestionFormValue;
  onSave: (question: QuestionFormValue) => void;
  onCancel: () => void;
}

const MemoizedOptionField = memo(OptionField);

export const QuestionForm = ({
  initialQuestion,
  onSave,
  onCancel,
}: QuestionFormProps) => {
  const methods = useForm<QuestionFormValue>({
    defaultValues: initialQuestion,
    resolver: zodResolver(questionFormSchema),
  });

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    clearErrors,
  } = methods;

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'answers',
  });

  const watchQuestionType = watch('question_type');

  useEffect(() => reset(initialQuestion), [initialQuestion, reset]);

  useEffect(() => clearErrors(), [watchQuestionType, clearErrors]);

  const handleSave = (data: QuestionFormValue) => {
    const answers = data.question_type !== 'number' ? data.answers : [];
    onSave({ ...data, answers });
  };

  const addOption = () => {
    const newOption = EMPTY_OPTION;
    append(newOption);
  };

  const removeOption = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  const undoChanges = () => {
    reset(initialQuestion);
    onCancel();
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={control}
            name="question_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип вопроса</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип вопроса" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typesField.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <ErrorMessage message={errors.answers?.root?.message} />
        </div>

        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Вопрос</FormLabel>
              <FormControl>
                <Input placeholder="Введите свой вопрос здесь" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchQuestionType !== 'number' ? (
          <div>
            <Reorder.Group
              layoutRoot
              layout="position"
              values={fields.map((field) => field.id)}
              onReorder={(newOrder) => onReorder(newOrder, fields, swap)}
              axis="y"
              className="flex flex-col items-stretch gap-3"
            >
              {fields.map((option, index) => (
                <MemoizedOptionField
                  key={option.id}
                  orderValue={option.id}
                  index={index}
                  onDelete={removeOption}
                  totalFields={fields.length}
                />
              ))}
            </Reorder.Group>
            <motion.div
              initial={false}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="mt-2"
              >
                Добавить вариант
              </Button>
            </motion.div>
          </div>
        ) : (
          <FormField
            control={control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Правильный ответ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите правильный ответ здесь"
                    type="number"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const newValue =
                        e.target.value === '' ? null : Number(e.target.value);
                      field.onChange(newValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={undoChanges}
            disabled={isSubmitting}
          >
            Отменить
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
