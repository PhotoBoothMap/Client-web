import { useBoothStore } from '@store/booth';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import BoothPreview from '../boothPreview';
import hamburgetScroll from '/public/image/hamburger_scroll.png';

function WrapperHeader() {
  return (
    <Header>
      <HamburgerScroll>
        <Image src={hamburgetScroll} alt="" />
      </HamburgerScroll>
    </Header>
  );
}

export default function PreviewsWrapper() {
  const curBoothPreviews = useBoothStore((state) => state.curBoothPreviews);
  const [curOffset, setCurOffset] = useState<number>(0);

  return (
    <Wrapper>
      <WrapperHeader />
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
  background-color: #242424;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HamburgerScroll = styled.div``;

const Body = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
`;
