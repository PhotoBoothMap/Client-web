import styled from 'styled-components';

import { PhotoBooth, photoBooth } from '@utils/interface/photoBooth';
import Image from 'next/image';

import Review from '@components/map/review';
import LogoBright from '@image/logo_bright.png';
import StarIcon from '@image/star_icon.png';
import StarsGrey from '@image/stars_grey.png';

import HeaderArrow from '/public/image/header_arrow.png';

interface BoothDetailPopProps {
  state: boolean;
  boothInfo: Partial<PhotoBooth> | null;
  setCurBoothDetail: (value: PhotoBooth | null) => void;
  setBoothDetailUp: (value: boolean) => void;
}

export default function BoothDetailPop({
  state,
  boothInfo,
  setCurBoothDetail,
  setBoothDetailUp,
}: BoothDetailPopProps) {
  const { boothDetail, review } = boothInfo ?? {
    boothDetail: {
      id: 3,
      brand: photoBooth.포토그레이,
      name: '테스트 네임',
      address: '서울 강남구 강남대로 102길 31 1층 4호',
      score: 4.5,
      reviewNum: 10,
    },
    review: [
      {
        user: 'test name',
        date: new Date('2023-04-17'),
        content: '여기 사진 진짜 잘 나오네요. 만족스러운 시간이었습니다. 다음에도 꼭 가고싶어요...',
        imgUrl: '',
        userTags: ['PICTURE', 'LIGHT', 'VARIOUS'],
      },
    ],
  };

  return (
    <Wrapper state={state}>
      <AppBar>
        <Image
          src={HeaderArrow}
          alt=""
          width="13"
          height="7"
          onClick={() => {
            setCurBoothDetail(null);
            setBoothDetailUp(false);
          }}
         />
        <p className="appbar_sentence">{boothDetail!.name}</p>
        <div className="blank"></div>
      </AppBar>
      <Header>
        <p className="header_title">{boothDetail!.name}</p>
        <p className="header_subtitle">{boothDetail!.address}</p>
        <div className="review_wrapper">
          <div className="score_wrapper">
            <Image src={StarIcon} alt="" height="14" />
            <p className="score">{boothDetail!.score}</p>
          </div>
          <div className="review">{`리뷰 ${boothDetail!.reviewNum}`}</div>
        </div>
      </Header>
      {/* <MetaWrapper>
        <div className="meta_line">
          <Image src={ClockIcon} alt="" width="14" />

          <p>{boothDetail.status}</p>
        </div>
        <div className="meta_line">
          <Image src={PhoneIcon} alt="" width="14" />
          <p>{boothDetail.call}</p>
        </div>
        <div className="meta_line">
          <Image src={CardIcon} alt="" width="14" />
          <p>{'카드 결제, 제로 페이'}</p>
        </div>
        <div className="meta_line">
          <Image src={FrameIcon} alt="" width="14" />
        </div>
      </MetaWrapper>
      <Pictures></Pictures> */}
      <ReviewHeader>
        <Image src={LogoBright} alt="" width="30" />
        <p>{`${boothDetail!.name} 어떠셨나요`}</p>
        <Image src={StarsGrey} alt="" width="100" />
      </ReviewHeader>
      <ReviewBody>
        {review?.map((reviewInfo) => {
          return <Review name={boothDetail!.name} score={boothDetail!.score} review={reviewInfo} />;
        })}
      </ReviewBody>
    </Wrapper>
  );
}

interface WrapperProps {
  state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: start;
  background-color: #242424;
  width: 100%;
  min-height: 100vh;
  z-index: 999;
  position: absolute;
  top: ${({ state }) => (state ? 0 : '100vh')};
  left: 0;
  transition: all 0.3s ease-in-out;
  padding-top: 20px;
`;

const AppBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 0 0 1;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 2rem;

  & > img {
    object-fit: contain;
  }

  & > .appbar_sentence {
    font-weight: 600;
    font-size: 18px;
  }

  & > div.blank {
    width: 13px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  & {
    > p.header_title {
      font-weight: 600;
      font-size: 24px;
      line-height: 29px;
    }

    > p.header_subtitle {
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
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

const MetaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  & > div.meta_line {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 0.25rem 0;

    > img {
      flex: 0 0 auto;
      object-fit: contain;
    }
    > p {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: #f2f2f2;
    }
  }
`;

const Pictures = styled.div``;

const ReviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(26, 26, 26, 0.7);

  img {
    flex: 0 0 auto;
    object-fit: contain;
  }

  p {
    color: white;
    font-weight: 600;
  }
`;

const ReviewBody = styled.div`

`;
