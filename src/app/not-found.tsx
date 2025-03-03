'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

import { BasePageContainer } from '@/components/common';
import { buttonVariants } from '@/components/shadcnUi/button';

import { APP_ROUTES } from '@/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

const titleVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const textVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const NotFound = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <BasePageContainer
        marginTop="withSpacing"
        marginBottom="withSpacing"
        padding="withSpacing"
      >
        <motion.div
          className="flex flex-col gap-6 p-4 text-center md:p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={iconVariants}>
            <AlertCircle className="mx-auto h-32 w-32 text-brand" />
          </motion.div>
          <div className="flex flex-col gap-4">
            <motion.h1
              className="text-6xl font-bold text-secondary-foreground"
              variants={titleVariants}
            >
              404
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              variants={textVariants}
            >
              Упс! Страница не найдена.
            </motion.p>
          </div>
          <motion.div variants={textVariants}>
            <Link
              href={APP_ROUTES.HOME}
              className={cn(
                buttonVariants({
                  size: 'lg',
                  variant: 'brand',
                }),
                'rounded-full text-lg'
              )}
            >
              Вернуться на главную
            </Link>
          </motion.div>
        </motion.div>
      </BasePageContainer>
    </div>
  );
};

export default NotFound;
