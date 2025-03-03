'use client';

import { useEffect, useState } from 'react';

export const useElementExceedsViewport = (
  ref: React.RefObject<HTMLElement | null>
) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkElementOverflow = () => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        setIsOverflowing(rect.height > viewportHeight);
      }
    };

    checkElementOverflow();

    window.addEventListener('resize', checkElementOverflow);

    return () => {
      window.removeEventListener('resize', checkElementOverflow);
    };
  }, [ref]);

  return isOverflowing;
};
