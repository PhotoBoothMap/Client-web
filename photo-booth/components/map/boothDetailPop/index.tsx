import styled from 'styled-components';

import { PhotoBooth, photoBooth, tagValue, tagsToKey } from '@utils/interface/photoBooth';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Review from '@components/map/review';
import LogoBright from '@image/logo_bright.png';
import PlusIcon from '@image/plus_icon.png';
import StarIcon from '@image/star_icon.png';

import StarRate from '@components/review/StarRate';
import { useLoginUserStore } from '@store/login';
import { useEffect, useMemo, useState } from 'react';
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
  const navigation = useRouter();
  const user = useLoginUserStore();

  const [starRate, setStarRate] = useState<number>(0);

  const testData: PhotoBooth = useMemo(() => {
    return {
      boothDetail: {
        id: 3,
        brand: photoBooth.포토그레이,
        name: '테스트 네임',
        address:
          '서울 강남구 강남대로 102길 31 1층 4호 서울 강남구 강남대로 102길 31 1층 4호 서울 강남구 강남대로 102길 31 1층 4호',
        score: 4.5,
        reviewNum: 10,
        tagNum: 200,
      },
      userTags: {
        '사진이 잘 나와요': 82,
        '보정이 자연스러워요': 65,
        '파우더룸이 잘 되어있어요': 27,
      },
      review: [
        {
          user: 'test name',
          brand: photoBooth.포토그레이,
          name: '테스트 네임 테스트 네임 테스트 네임',
          date: undefined,
          content:
            '여기 사진 진짜 잘 나오네요. 만족스러운 시간이었습니다. 다음에도 꼭 가고싶어요...',
          score: 4.5,
          imgUrl: [
            `${process.env.NEXT_PUBLIC_HOST}image/white_mark_map.png`,
            `${process.env.NEXT_PUBLIC_HOST}image/white_mark_map.png`,
            `${process.env.NEXT_PUBLIC_HOST}image/white_mark_map.png`,
          ],
          userTags: ['사진이 잘 나와요', '조명이 좋아요', '파우더룸이 잘 되어있어요'] as tagValue[],
        },
      ],
    };
  }, []);

  const { boothDetail, userTags, review } = useMemo(() => {
    const { boothDetail, userTags, review } = boothInfo ?? testData;
    // const { boothDetail, userTags, review } = testData;

    return { boothDetail, userTags, review };
  }, [boothInfo]);

  useEffect(() => {
    if (boothDetail && starRate > 0) {
      if (user.id) {
        navigation.push(
          `/booth/${boothDetail.id}/review/create?starRate=${starRate}&boothName=${boothDetail.name}`,
        );
      } else {
        alert('로그인이 필요한 서비스입니다.');
        navigation.push('/account/login');
      }
    }
  }, [starRate]);

  return (
    <Wrapper state={state}>
      <AppBar>
        <Image
          src={HeaderArrow}
          alt=""
          width="24"
          height="24"
          onClick={() => {
            // setCurBoothDetail(null);
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
      <UserReview>
        <div className="user_review_header">
          <p className="content">User Reviews</p>
          <p className="number">{'(' + boothDetail?.tagNum! + ')'}</p>
        </div>
        <div className="user_review_body">
          {(Object.keys(userTags!) as tagValue[]).map((userTag, idx) => {
            const tagKey = tagsToKey[userTag];
            const value = userTags![userTag];
            return (
              <div className="review_row" key={`${userTag}${idx}`}>
                <div className="row_left">
                  <Image
                    src={`/common/review/tag/${tagKey}.svg`}
                    width={18}
                    height={18}
                    alt={`${userTag}`}
                  />
                  <div className={`review_text font-semibold text-[#F2F2F2]`}>{userTag}</div>
                </div>
                <div className="row_right">
                  <Stick
                    width={150}
                    rate={value! / (boothDetail?.tagNum! === 0 ? 1 : boothDetail?.tagNum!)}
                  >
                    <div className="stick"></div>
                  </Stick>
                  <div className="rate">{`${value}/${boothDetail?.tagNum!}`}</div>
                </div>
              </div>
            );
          })}
        </div>
      </UserReview>
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
      <ReviewWrapper>
        <ReviewHeader>
          <Image src={LogoBright} alt="" width="44" />
          <p>{`${boothDetail!.name} 어떠셨나요?`}</p>
          <StarRate starRate={starRate} setStarRate={setStarRate} />
        </ReviewHeader>
        <ReviewBody>
          {review?.map((reviewInfo, idx) => {
            return (
              <Review
                key={`${reviewInfo.name}${idx}`}
                name={reviewInfo!.name}
                score={reviewInfo!.score}
                review={reviewInfo}
              />
            );
          })}
        </ReviewBody>
        <Footer
          onClick={() => {
            navigation.push(`/booth/${boothDetail!.id}/review/list`);
          }}
        >
          <span>리뷰 더보기</span>
          <Image src={PlusIcon} alt="" height="14" />
        </Footer>
      </ReviewWrapper>
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
  height: 100vh;
  z-index: 999;
  position: absolute;
  top: ${({ state }) => (state ? 0 : '100vh')};
  left: 0;
  transition: all 0.3s ease-in-out;
  padding-top: 20px;
  overflow-y: scroll;
  color: white;
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
      text-align: center;
      padding-left: 1rem;
      padding-right: 1rem;
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

const UserReview = styled.div`
  padding: 1rem;
  & {
    div.user_review_header {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.25rem;

      p.content {
        font-size: 18px;
        font-weight: 700;
      }
      p.number {
        font-size: 12px;
        color: rgba(242, 242, 242, 0.7);
      }
    }
    div.user_review_body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;

      div.review_row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        & {
          div.row_left {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            div.review_text {
              font-size: 14px;
            }
          }
          div.row_right {
            display: flex;
            flex-direction: row;
            align-items: center;
            div.rate {
              font-size: 12px;
              color: rgba(242, 242, 242, 0.7);
            }
          }
        }
      }
    }
  }
`;

interface StickProps {
  width: number;
  rate: number;
}

const Stick = styled.div<StickProps>`
  width: ${({ width }) => `${width}px`};
  height: 6px;
  background-color: rgba(42, 42, 42, 1);
  flex: 0 0 auto;
  & {
    div.stick {
      width: ${({ width, rate }) => `${width * rate}px`};
      height: 100%;
      background-color: rgba(255, 199, 0, 1);
      flex: 0 0 auto;
    }
  }
`;

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background-color: rgba(26, 26, 26, 0.7);
  padding: 1.25rem 0rem;
  border-radius: 12px;

  img {
    flex: 0 0 auto;
    object-fit: contain;
  }

  p {
    color: white;
    font-size: 18px;
    font-weight: 600;
  }
`;

const ReviewBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1em;
  background-color: rgba(26, 26, 26, 0.7);
  border-radius: 0.5rem;
  gap: 4px;
  & {
    span {
      font-size: 14px;
    }
  }
`;
