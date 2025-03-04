'use client';

import { useEffect, useState } from 'react';

export const useElementExceedsViewport = (
  ref: React.RefObject<HTMLElement | null>
) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const checkOverflow = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      setIsOverflowing(rect.height > viewportHeight);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);

    window.addEventListener('resize', checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [ref]);

  return isOverflowing;
};
