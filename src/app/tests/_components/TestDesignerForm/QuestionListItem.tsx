'use client';

import { useMemo } from 'react';

import { Edit, X } from 'lucide-react';

import { QuestionFormValue } from '@/schemas/test';

import { Button } from '@/components/shadcnUi/button';
import { Card, CardContent } from '@/components/shadcnUi/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcnUi/tooltip';

import { typesField } from '@/config';

export const QuestionListItem = ({
  question,
  index,
  onEdit,
  onDelete,
  disabled = false,
}: {
  question: QuestionFormValue & { id: string };
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) => {
  const { title, question_type, answers, answer } = question;
  const type = useMemo(
    () => typesField.find((type) => type.value === question_type),
    [question_type]
  );

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex-grow">
          <h3 className="mb-2 text-lg font-semibold">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="mr-2">{type?.icon}</TooltipTrigger>
                <TooltipContent>
                  <p>{type?.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {index + 1}. {title}
          </h3>
          {answers.length > 0 && question_type !== 'number' && (
            <ol className="list-inside list-decimal space-y-1 pl-2">
              {answers.map((option, optionIndex) => (
                <li
                  key={optionIndex}
                  className={option.is_right ? 'text-green-600' : ''}
                >
                  {option.text}
                </li>
              ))}
            </ol>
          )}
          {question_type === 'number' && (
            <p className="pl-2">Правильный ответ: {answer}</p>
          )}
        </div>
        <div className="flex flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            disabled={disabled}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
