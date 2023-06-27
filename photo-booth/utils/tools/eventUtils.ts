import { DragEvent } from 'react';

export const dragEvent = (e: DragEvent<HTMLImageElement>) => {
  const windowHeight = window.innerHeight;
  const pointerHeight = e.clientY;

  console.log(pointerHeight);
  return (pointerHeight / windowHeight) * 100;
};
