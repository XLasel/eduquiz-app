'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import { BasePageContainer } from '@/components/common';
import { Hero3DScene } from '@/components/common/Hero3DScene';
import { buttonVariants } from '@/components/shadcnUi/button';

import { APP_ROUTES } from '@/constants';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, staggerChildren: 0.3 },
  },
};

const titleContainerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1 },
  },
};

const gradientVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: [0.4, 0.6, 0.5, 0.7, 0.5],
    scale: [0.9, 1, 0.95, 1.05, 1],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      times: [0, 0.25, 0.5, 0.75, 1],
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
};

const buttonAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1 },
  },
};

const heroSceneVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2 },
  },
};

const Home = () => {
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex-1">
      <div className="relative flex min-h-[var(--content-height)] w-full flex-col bg-background">
        <motion.div
          className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[80%] w-[80%] rounded-full bg-gradient-radial from-indigo-600 via-yellow-500/50 to-transparent blur-[50px] dark:from-pink-500 dark:via-purple-500/70 dark:to-transparent"
          variants={gradientVariants}
          initial="hidden"
          animate="visible"
        />
        <AnimatePresence>
          {isContentLoaded && (
            <motion.div
              className="absolute inset-0 z-0 h-full"
              variants={heroSceneVariants}
              initial="hidden"
              animate="visible"
            >
              <Hero3DScene />
            </motion.div>
          )}
        </AnimatePresence>

        <section className="pointer-events-none grid flex-1 place-items-center">
          <BasePageContainer className="z-10 my-auto px-4 py-4 md:py-6">
            <motion.div
              className="relative space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="relative max-w-[700px]"
                variants={titleContainerVariants}
              >
                <h1 className="relative z-10 text-4xl font-extrabold tracking-tight sm:text-7xl lg:text-[80px]/none">
                  Открывайте новые горизонты знаний вместе с&nbsp;нами
                </h1>
                <p className="relative z-10 mt-4 text-xl text-zinc-800 dark:text-zinc-200 sm:text-2xl">
                  Проходите увлекательные тесты и делитесь знаниями
                  в&nbsp;дружественной атмосфере
                </p>
              </motion.div>

              <motion.div variants={buttonAnimation}>
                <div className="inline-block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ transformOrigin: 'center' }}
                  >
                    <Link
                      href={APP_ROUTES.TESTS.LIST}
                      className={cn(
                        buttonVariants({
                          size: 'lg',
                          variant: 'brand',
                        }),
                        'pointer-events-auto rounded-full text-lg'
                      )}
                    >
                      К тестам <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </BasePageContainer>
        </section>
      </div>
    </main>
  );
};

export default Home;
