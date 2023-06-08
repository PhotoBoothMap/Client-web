import { useBoothStore } from '@store/booth';

import Image from 'next/image';
import { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import BoothPreview from '../boothPreview';
import hamburgetScroll from '/public/image/hamburger_scroll.png';

export default function PreviewsWrapper() {
  const curBoothPreviews = useBoothStore((state) => state.curBoothPreviews);
  const [curOffset, setCurOffset] = useState<number>(0);
  const [mouseBeforePosition, setMouseBeforePosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    setIsDragging(true);
    setMouseBeforePosition(e.clientY);
  };

  const handleMouseUp = (e: MouseEvent<HTMLImageElement>) => {
    setIsDragging(false);
    setMouseBeforePosition(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (isDragging) {
      const dy = e.clientY - mouseBeforePosition;
      const neOffset = curOffset + dy;
      if (dy < 0 && neOffset < window.innerHeight * 0.5 && neOffset > window.innerHeight * 0.45) {
        setCurOffset(window.innerHeight * 0.2);
        setIsDragging(false);
        return;
      }

      if (dy > 0 && neOffset > window.innerHeight * 0.3 && neOffset < window.innerHeight * 0.35) {
        setCurOffset(window.innerHeight * 0.8);
        setIsDragging(false);
        return;
      }

      if (neOffset < window.innerHeight * 0.2) {
        return;
      }

      if (neOffset > window.innerHeight * 0.8) {
        return;
      }

      setCurOffset(curOffset + dy);
      setMouseBeforePosition(e.clientY);
    }
  };

  useEffect(() => {
    setCurOffset(window.innerHeight * 0.8);
  }, []);

  return (
    <Wrapper state={isDragging} offset={curOffset} onMouseMove={handleMouseMove}>
      <div className="blank"></div>
      <Header state={isDragging}>
        <HamburgerScroll>
          <Image
            src={hamburgetScroll}
            alt=""
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
              id={id}
              brand={brand}
              name={name}
              distance={distance}
              address={address}
              score={score}
              reviewNum={reviewNum}
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
  display: flex;
  flex-direction: column;
  justify-content: start;
  z-index: 0;
`;
