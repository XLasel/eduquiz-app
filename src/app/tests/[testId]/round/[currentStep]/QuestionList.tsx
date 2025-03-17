import { cn } from '@/lib/utils';

import { Question } from '@/schemas/test';
import { UserAnswerData } from '@/types/session';

import { Button } from '@/components/shadcnUi/button';

import { Navigation } from './page';

export const QuestionList = ({
  questions,
  step,
  userAnswers,
  goToQuestion,
}: {
  questions: Question[];
  step: number;
  userAnswers: UserAnswerData[];
  goToQuestion: Navigation['goToQuestion'];
}) => {
  return (
    <div className="overflow-hidden">
      <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Перейти к вопросу:
          </h3>
          <div className="text-xs text-muted-foreground">
            Отвечено: {userAnswers.length}/{questions.length}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
          {questions.map((question, index) => {
            const questionNumber = index + 1;
            const isCurrentQuestion = questionNumber === step;
            const isAnswered = userAnswers.some(
              (a) => a.questionId === question.id
            );

            return (
              <Button
                key={question.id}
                variant={isCurrentQuestion ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'relative aspect-square w-full border-2 sm:aspect-auto sm:w-auto',
                  isAnswered ? 'border-green-500 dark:border-green-600' : ''
                )}
                onClick={() => goToQuestion(questionNumber)}
              >
                {questionNumber}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
