'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { getPanelElement } from 'react-resizable-panels';
import useMeasure from 'react-use-measure';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUp, Plus, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  QuestionFormValue,
  Test,
  testFormSchema,
  TestFormValue,
} from '@/schemas/test';

import { ConfirmationDialog } from '@/components/common';
import { Button } from '@/components/shadcnUi/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/shadcnUi/form';
import { Input } from '@/components/shadcnUi/input';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/shadcnUi/resizable';
import { Sheet, SheetContent, SheetTitle } from '@/components/shadcnUi/sheet';

import { APP_ROUTES, EMPTY_QUESTION } from '@/constants';
import { useDeviceInfo, useElementExceedsViewport, useToast } from '@/hooks';

import { DeleteButton, ResetButton, SaveButton } from './ActionButtons';
import { QuestionForm } from './QuestionForm';
import { QuestionListItem } from './QuestionListItem';

interface TestDesignerProps {
  initialData?: Test;
  onSave: (data: TestFormValue) => void;
  onDelete?: () => void;
}

const scrollToTop = () => {
  window?.scrollTo({ top: 0, behavior: 'smooth' });
};

export const TestDesignerForm = ({
  initialData,
  onSave,
  onDelete,
}: TestDesignerProps) => {
  const methods = useForm<TestFormValue>({
    defaultValues: {
      id: initialData?.id ?? undefined,
      title: initialData?.title || '',
      questions: initialData?.questions || [],
    },
    resolver: zodResolver(testFormSchema),
  });
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, errors },
  } = methods;
  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: 'questions',
  });
  const router = useRouter();
  const { isWideScreen } = useDeviceInfo();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionFormValue>(EMPTY_QUESTION);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [isDeleteTestModalOpen, setIsDeleteTestModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isOverflowing = useElementExceedsViewport(containerRef);
  const [refPanel, { width }] = useMeasure();

  const { toast } = useToast();

  useLayoutEffect(() => {
    if (initialData) {
      reset({
        id: initialData?.id ?? undefined,
        title: initialData?.title || '',
        questions: initialData?.questions || [],
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (editingQuestionIndex !== null) {
      setCurrentQuestion(getValues(`questions.${editingQuestionIndex}`));
    } else {
      setCurrentQuestion(EMPTY_QUESTION);
    }
  }, [editingQuestionIndex, getValues]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        if (error?.message) {
          toast({
            title: error.message,
            variant: 'destructive',
          });
        }
      });
    }
  }, [errors, toast]);

  useEffect(() => {
    const panel = getPanelElement('question-form');
    refPanel(panel);
  }, [width, refPanel]);

  const handleDeleteTest = () => {
    setIsDeleteTestModalOpen(true);
  };

  const confirmDeleteTest = () => {
    if (onDelete) onDelete();
    setIsDeleteTestModalOpen(false);
    toast({ title: 'Success', description: 'Тест успешно удален' });
    router.push(APP_ROUTES.TESTS.LIST);
  };

  const handleAddQuestion = () => {
    setIsAddingQuestion(true);
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setIsAddingQuestion(true);
  };

  const handleSaveQuestion = (question: QuestionFormValue) => {
    if (editingQuestionIndex !== null) {
      update(editingQuestionIndex, question);
    } else {
      append(question);
    }
    setIsAddingQuestion(false);
    setEditingQuestionIndex(null);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestionToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteQuestion = () => {
    if (questionToDelete !== null) {
      remove(questionToDelete);
      setIsDeleteModalOpen(false);
      setQuestionToDelete(null);
    }
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          className={cn(
            'flex flex-1 flex-col gap-6',
            isAddingQuestion && isWideScreen && 'pr-4'
          )}
          minSize={25}
        >
          <Form {...methods}>
            <form
              id="form"
              onSubmit={handleSubmit(onSave)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
                <h1 className="truncate text-2xl font-bold">
                  {initialData ? 'Редактирование теста' : 'Создание теста'}
                </h1>
                <div className="flex flex-1 justify-end gap-2 self-end sm:flex-initial">
                  <ResetButton
                    isDirty={isDirty}
                    onClick={() => reset(initialData)}
                  />
                  {initialData && <DeleteButton onClick={handleDeleteTest} />}
                  <SaveButton
                    isDirty={true}
                    formId="form"
                    label="adaptive"
                    className="w-full md:w-auto"
                  />
                </div>
              </div>
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="px-1">
                    <FormControl>
                      <Input
                        className="text-xl font-semibold"
                        placeholder="Название теста"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="flex flex-1 flex-col gap-5 overflow-auto">
            <Button onClick={handleAddQuestion} size="lg" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Добавить Вопрос
            </Button>
            <div ref={containerRef}>
              {fields.length > 0 && (
                <ul className="flex flex-col gap-4">
                  {fields.map((question, index) => (
                    <QuestionListItem
                      key={question.id}
                      question={question}
                      index={index}
                      onEdit={() => handleEditQuestion(index)}
                      onDelete={() => handleDeleteQuestion(index)}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
          {isOverflowing && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={scrollToTop}
            >
              <ArrowUp className="mr-2 h-4 w-4" /> Наверх
            </Button>
          )}
        </ResizablePanel>
        {isAddingQuestion && isWideScreen && (
          <>
            <ResizableHandle />
            <ResizablePanel
              id="question-form"
              className="relative overflow-auto border-l bg-background p-4"
              defaultSize={50}
              minSize={25}
            >
              <div className="w-full">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {editingQuestionIndex ? 'Редактировать' : 'Добавить'} вопрос
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddingQuestion(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <QuestionForm
                  initialQuestion={currentQuestion}
                  onSave={handleSaveQuestion}
                  onCancel={() => setIsAddingQuestion(false)}
                />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      {!isWideScreen && (
        <Sheet open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
          <SheetContent
            side="right"
            className="flex w-full flex-col gap-6 overflow-y-scroll sm:max-w-[500px]"
          >
            <SheetTitle className="text-2xl font-bold">
              {editingQuestionIndex !== null ? 'Редактировать' : 'Добавить'}{' '}
              вопрос
            </SheetTitle>
            <QuestionForm
              initialQuestion={currentQuestion}
              onSave={handleSaveQuestion}
              onCancel={() => setIsAddingQuestion(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      <ConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Удалить вопрос?"
        message="Вы уверены, что хотите удалить этот вопрос?"
        confirmText="Удалить"
        confirmVariant="destructive"
        onConfirm={confirmDeleteQuestion}
      />

      <ConfirmationDialog
        open={isDeleteTestModalOpen}
        onOpenChange={setIsDeleteTestModalOpen}
        title="Удалить тест?"
        message="Вы уверены, что хотите удалить этот тест? Это действие нельзя отменить."
        confirmText="Удалить тест"
        confirmVariant="destructive"
        onConfirm={confirmDeleteTest}
      />
    </>
  );
};
