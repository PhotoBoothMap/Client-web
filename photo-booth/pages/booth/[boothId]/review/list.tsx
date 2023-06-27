import { ArrowBack } from '@mui/icons-material';
import styled from 'styled-components';

import ReviewComp from '@components/map/review';
import { requestReviewApi } from '@repositories/booth/review';
import { useOnScreen } from '@utils/hook/useOnScreen';
import { Review } from '@utils/interface/photoBooth';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function BoothReviewList() {
  const navigation = useRouter();

  const [curReviews, setCurReviews] = useState<Array<Review>>([]);

  //무한 스크롤에 필요한 훅들
  const curPage = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const getReviews = async () => {
    setIsRequesting(true);
    try {
      const { review } = await requestReviewApi(Number(navigation.query.boothId), curPage.current);
      if (review.length === 0) {
        curPage.current = -1;
      } else {
        curPage.current += 10;
        setCurReviews([...curReviews, ...review]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    if (isOnScreen && !isRequesting && curPage.current !== -1) {
      getReviews();
    }
  }, [curPage, isOnScreen, isRequesting]);

  return (
    <Wrapper>
      <Header>
        <ArrowBack />
        <p></p>
      </Header>
      <Body>
        {curReviews.map((review) => {
          return <ReviewComp name="" score={review.score} review={review} />;
        })}
        <LastLine ref={curPage.current === -1 ? null : elementRef}></LastLine>
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 0.5rem;
  background-color: #242424;
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
`;

const Header = styled.div``;

const Body = styled.div`
    display : flex;
    flex-direction: column;
    
`;

const LastLine = styled.div`
  opacity: 0;
  width: 10px;
  height: 10px;
`;
