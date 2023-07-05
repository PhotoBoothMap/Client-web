import { DragEvent } from 'react';

export const dragEvent = (e: DragEvent<HTMLImageElement>) => {
  const windowHeight = window.innerHeight;
  const pointerHeight = e.clientY;

  return (pointerHeight / windowHeight) * 100;
};
