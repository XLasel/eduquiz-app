'use client';

import { useRouter } from 'next/navigation';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/shadcnUi/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcnUi/card';

export const QuestionNotFound = () => {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <CardTitle className="mt-4 text-xl font-semibold">
            Вопрос не найден
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Возможно, вопрос был удалён или вы перешли по неверной ссылке.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              onClick={() => router.back()}
              variant="default"
              className="w-full"
            >
              Вернуться назад
            </Button>
            <Button
              onClick={() => router.push('/tests')}
              variant="outline"
              className="w-full"
            >
              К списку тестов
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
