import { useBoothStore } from '@store/booth';

import { BoothPreview, PhotoBooth } from '@utils/interface/photoBooth';

import { useOnScreen } from '@utils/hook/useOnScreen';
import Image from 'next/image';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import BoothPreviewComp from '../boothPreview';
import hamburgetScroll from '/public/image/hamburger_scroll.png';

interface PreviewWrapperProps {
  setCurBoothDetail: (value: PhotoBooth) => void;
  setBoothDetailUp: (value: boolean) => void;
  getPreviews: (value: BoothPreview[]) => void;
}

export default function PreviewsWrapper({
  setCurBoothDetail,
  setBoothDetailUp,
  getPreviews,
}: PreviewWrapperProps) {
  const curBoothPreviews = useBoothStore((state) => state.curBoothPreviews);
  const [curOffset, setCurOffset] = useState<number>(0);
  const [mouseBeforePosition, setMouseBeforePosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  //무한 스크롤에 필요한 훅들
  const curPage = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    setIsDragging(true);
    setMouseBeforePosition(e.clientY);
  };

  const handleTouchDown = (v: number) => {
    setIsDragging(true);
    setMouseBeforePosition(v);
  };

  const handleMouseUp = (e: MouseEvent<HTMLImageElement>) => {
    setIsDragging(false);
    setMouseBeforePosition(e.clientY);
  };

  const handleTouchEnd = (v: number) => {
    setIsDragging(false);
    setMouseBeforePosition(v);
  };

  const handleTouchMove = (v: number) => {
    if (isDragging) {
      const dy = v - mouseBeforePosition;
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
      setMouseBeforePosition(v);
    }
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

  useEffect(() => {
    if (isOnScreen && !isRequesting && curPage.current !== -1) {
      getPreviews(curBoothPreviews);
    }
  }, [isOnScreen, isRequesting]);

  return (
    <Wrapper
      state={isDragging}
      offset={curOffset}
      onMouseMove={handleMouseMove}
      onTouchMove={(e) => {
        const height = e.changedTouches[0].pageY;
        handleTouchMove(height);
      }}
      onMouseUp={handleMouseUp}
      onTouchEnd={(e) => {
        const height = e.changedTouches[0].pageY;
        handleTouchEnd(height);
      }}
    >
      <div className="blank"></div>
      <Header
        state={isDragging}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={(e) => {
          const height = e.changedTouches[0].pageY;
          handleTouchDown(height);
        }}
        onTouchEnd={(e) => {
          const height = e.changedTouches[0].pageY;
          handleTouchEnd(height);
        }}
      >
        <HamburgerScroll>
          <Image width="40" src={hamburgetScroll} alt="" />
        </HamburgerScroll>
      </Header>
      <Body>
        {curBoothPreviews.map((previewInfo, idx) => {
          const { id, brand, name, distance, address, score, reviewNum } = previewInfo;
          return (
            <BoothPreviewComp
              key={`${id}${idx}`}
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
        <LastLine ref={curPage.current === -1 ? null : elementRef}></LastLine>
        <Vacant state={curPage.current === -1} height={1000} />
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
  overflow-y: scroll;
`;

const LastLine = styled.div`
  opacity: 0;
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
`;

interface VacantProps {
  state: boolean;
  height: number;
}

const Vacant = styled.div<VacantProps>`
  display: ${({ state }) => (state ? 'none' : 'block')};
  height: ${({ height }) => `${height}px`};
  flex: 0 0 auto;
`;
