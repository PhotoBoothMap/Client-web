import { useBoothStore } from '@store/booth';

import { PhotoBooth } from '@utils/interface/photoBooth';

import Image from 'next/image';
import { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import BoothPreview from '../boothPreview';
import hamburgetScroll from '/public/image/hamburger_scroll.png';

interface PreviewWrapperProps {
  setCurBoothDetail: (value: PhotoBooth) => void;
  setBoothDetailUp: (value: boolean) => void;
}

export default function PreviewsWrapper({
  setCurBoothDetail,
  setBoothDetailUp,
}: PreviewWrapperProps) {
  const curBoothPreviews = useBoothStore((state) => state.curBoothPreviews);
  const [curOffset, setCurOffset] = useState<number>(0);
  const [mouseBeforePosition, setMouseBeforePosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    setIsDragging(true);
    setMouseBeforePosition(e.clientY);
  };

  const handleMouseUp = (e: MouseEvent<HTMLImageElement>) => {
    console.log('is mouse up');
    setIsDragging(false);
    setMouseBeforePosition(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (isDragging) {
      const dy = e.clientY - mouseBeforePosition;
      const neOffset = curOffset + dy;
      if (dy < 0 && neOffset < window.innerHeight * 0.7 && neOffset > window.innerHeight * 0.6) {
        setCurOffset(window.innerHeight * 0.2);
        setIsDragging(false);
        return;
      }

      if (dy > 0 && neOffset > window.innerHeight * 0.3 && neOffset < window.innerHeight * 0.35) {
        setCurOffset(window.innerHeight * 0.9);
        setIsDragging(false);
        return;
      }

      if (neOffset < window.innerHeight * 0.2) {
        return;
      }

      if (neOffset > window.innerHeight * 0.9) {
        return;
      }

      setCurOffset(curOffset + dy);
      setMouseBeforePosition(e.clientY);
    }
  };

  useEffect(() => {
    setCurOffset(window.innerHeight * 0.9);
  }, []);

  return (
    <Wrapper
      state={isDragging}
      offset={curOffset}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="blank"></div>
      <Header state={isDragging}>
        <HamburgerScroll>
          <Image
            width="40"
            src={hamburgetScroll}
            alt=""
            draggable="false"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
        </HamburgerScroll>
      </Header>
      <Body>
        {curBoothPreviews.map((previewInfo) => {
          const { id, brand, name, distance, address, score, reviewNum } = previewInfo;
          return (
            <BoothPreview
              key={id}
              id={id}
              brand={brand}
              name={name}
              distance={distance}
              address={address}
              score={score}
              reviewNum={reviewNum}
              setCurBoothDetail={setCurBoothDetail}
              setBoothDetailUp={setBoothDetailUp}
            />
          );
        })}
      </Body>
    </Wrapper>
  );
}

interface WrapperProps {
  state: boolean;
  offset: number;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: absolute;
  top: ${({ offset }) => `${offset}px`};
  transition: all 0.1s;
  width: 100%;
  height: 100vh;
  z-index: 99;
  border-radius: 30px 30px 0 0;
  background-color: #242424;
  & > .blank {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;

    display: ${({ state }) => (state ? 'block' : 'none')};
  }
`;

interface HeaderProps {
  state: boolean;
}

const Header = styled.div<HeaderProps>`
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 0;
`;

const HamburgerScroll = styled.div``;

const Body = styled.ul`
  width: 100%;
  height: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  z-index: 0;
`;
