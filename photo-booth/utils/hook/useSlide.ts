import { useCallback, useState } from 'react';

export const useSlide = (): [number, () => void, () => void] => {
  const [curView, setCurView] = useState<number>(0);
  const onSlideLeft = useCallback(() => {
    setCurView(curView - 1);
  }, [curView]);

  const onSlideRight = useCallback(() => {
    setCurView(curView + 1);
  }, [curView]);

  return [curView, onSlideLeft, onSlideRight];
};
