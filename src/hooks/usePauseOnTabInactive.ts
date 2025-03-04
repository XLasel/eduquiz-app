'use client';

import { useEffect, useRef } from 'react';

import { useThree } from '@react-three/fiber';

type PauseOptions = {
  stopClock?: boolean;
  setVisibilityFlag?: (isVisible: boolean) => void;
};

export const usePauseOnTabInactive = ({
  stopClock = false,
  setVisibilityFlag,
}: PauseOptions = {}) => {
  const { clock } = useThree();
  const wasRunning = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;

      if (stopClock) {
        if (!isVisible) {
          clock.stop();
          wasRunning.current = true;
        } else if (wasRunning.current) {
          clock.start();
          wasRunning.current = false;
        }
      }

      if (setVisibilityFlag) {
        setVisibilityFlag(isVisible);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [clock, stopClock, setVisibilityFlag]);
};
