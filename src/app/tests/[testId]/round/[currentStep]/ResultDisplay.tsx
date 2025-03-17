'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Star, Trophy } from 'lucide-react';

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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/shadcnUi/drawer';
import { Progress } from '@/components/shadcnUi/progress';

import { useDeviceInfo } from '@/hooks';

interface ResultDisplayProps {
  showResults: boolean;
  setShowResults: (showResults: boolean) => void;
  confirmExit: () => void;
  score: number;
  testLength: number;
}

export const ResultDisplay = ({
  showResults,
  setShowResults,
  confirmExit,
  score,
  testLength,
}: ResultDisplayProps) => {
  const { isMobile } = useDeviceInfo();
  const percentage = Math.round((score / testLength) * 100);

  const getResultFeedback = () => {
    if (percentage >= 90)
      return {
        icon: <Trophy className="h-12 w-12 text-result-excellent" />,
        message: 'Отличный результат! Вы настоящий эксперт!',
        class: 'text-result-excellent',
      };
    if (percentage >= 70)
      return {
        icon: <Star className="h-12 w-12 text-result-good" />,
        message: 'Хороший результат! Вы многое знаете.',
        class: 'text-result-good',
      };
    if (percentage >= 50)
      return {
        icon: <CheckCircle className="h-12 w-12 text-result-average" />,
        message: 'Неплохой результат. Есть куда расти!',
        class: 'text-result-average',
      };
    return {
      icon: <AlertCircle className="h-12 w-12 text-result-poor" />,
      message: 'Попробуйте еще раз. Практика ведет к\u00A0совершенству!',
      class: 'text-result-poor',
    };
  };

  const feedback = getResultFeedback();

  const ResultContent = () => (
    <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        {feedback.icon}
      </motion.div>

      <h3 className={`text-2xl font-bold ${feedback.class}`}>
        {score} из {testLength} правильных ответов
      </h3>

      <div className="flex flex-col items-center justify-center gap-2">
        <Progress
          value={percentage}
          className="h-3 w-full"
          indicatorClassName={getProgressColor(percentage)}
        />

        <p className="text-base text-muted-foreground">{feedback.message}</p>
      </div>
    </div>
  );

  function getProgressColor(percent: number): string {
    if (percent >= 90) return 'bg-result-excellent';
    if (percent >= 70) return 'bg-result-good';
    if (percent >= 50) return 'bg-result-average';
    return 'bg-result-poor';
  }

  if (isMobile) {
    return (
      <Drawer open={showResults} onOpenChange={setShowResults}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">Результаты теста</DrawerTitle>
          </DrawerHeader>

          <div className="px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ResultContent />
            </motion.div>
          </div>

          <DrawerFooter>
            <Button onClick={confirmExit} className="w-full">
              Вернуться к списку тестов
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={showResults} onOpenChange={setShowResults}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Результаты теста</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ResultContent />
        </motion.div>

        <DialogFooter>
          <Button onClick={confirmExit} className="w-full">
            Вернуться к списку тестов
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
