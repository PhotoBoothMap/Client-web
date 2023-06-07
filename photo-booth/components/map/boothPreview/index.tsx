import { BoothColor } from '@assets/const';
import { BoothPreview as BoothPreviewProps, photoBooth } from '@utils/interface/photoBooth';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import markBlued from '@image/blue_mark.png';
import markDarkGrey from '@image/darkgrey_mark.png';
import markGreen from '@image/green_mark.png';
import markGrey from '@image/grey_mark.png';
import markPink from '@image/pink_mark.png';
import markRed from '@image/red_mark.png';
import starIcon from '@image/star_icon.png';
import markYellow from '@image/yellow_mark.png';

export default function BoothPreview({
  id,
  brand,
  name,
  distance,
  address,
  score,
  reviewNum,
}: BoothPreviewProps) {
  const [curIcon, setCurIcon] = useState<StaticImageData | null>(null);

  useEffect(() => {
    let boothIcon = null;
    switch (brand) {
      case photoBooth.하루필름:
        boothIcon = markBlued;
        break;
      case photoBooth.포토이즘:
        boothIcon = markYellow;
        break;
      case photoBooth.포토매틱:
        boothIcon = markRed;
        break;
      case photoBooth.포토그레이:
        boothIcon = markGrey;
        break;
      case photoBooth.인생네컷:
        boothIcon = markPink;
        break;
      case photoBooth.셀픽스:
        boothIcon = markGreen;
        break;
      case photoBooth.기타:
        boothIcon = markDarkGrey;
        break;
    }
    setCurIcon(boothIcon);
  }, []);

  return (
    <Wrapper>
      <Body>
        <p className="title">{name}</p>
        <p className="address">{address}</p>
        <div className="review_wrapper">
          <div className="score_wrapper">
            <Image src={starIcon} alt="" />
            <p className="score">{score}</p>
          </div>
          <div className="review">{`리뷰 ${reviewNum}`}</div>
        </div>
      </Body>
      <BoothIconWrapper color={BoothColor[brand!]}>
        <Image src={curIcon ?? ''} alt="" />
        <p className="distance">{distance}</p>
      </BoothIconWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid #ffffff;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  & {
    > p.title {
    }

    > p.address {
    }

    > div.review_wrapper {
      > div.score_wrapper {
      }

      > p.score {
      }
    }
  }
`;

interface BoothIconWrapperProps {
  color: string;
}

const BoothIconWrapper = styled.div<BoothIconWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  & {
    > div.distance {
      color: ${({ color }) => color};
    }
  }
`;
