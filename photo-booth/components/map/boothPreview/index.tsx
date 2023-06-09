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
            <Image src={starIcon} alt="" height="14" />
            <p className="score">{score}</p>
          </div>
          <div className="review">{`리뷰 ${reviewNum}`}</div>
        </div>
      </Body>
      <BoothIconWrapper color={BoothColor[brand!]}>
        <Image src={curIcon ?? ''} alt="" height="40" />
        <p className="distance">{distance + 'm'}</p>
      </BoothIconWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  & {
    > p.title {
      font-style: normal;
      font-size: 16px;
      line-height: 19px;
      font-weight: 600;
      margin-bottom: 6px;
    }

    > p.address {
      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
      margin-bottom: 8px;
      color: #c9c9c9;
    }

    > div.review_wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;

      > div.score_wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-right: 2px solid #666666;
        gap: 8px;
        height: 16px;
        font-size: 14px;
        padding-right: 10px;
      }

      > p.score {
      }

      > div.review {
        padding-left: 0.5rem;
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
  align-items: center;
  gap: 5px;
  & {
    > p.distance {
      font-size: 14px;
      color: ${({ color }) => color};
    }
  }
`;
