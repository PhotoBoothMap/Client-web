import BasicHeader from '@components/common/header/BasicHeader';
import { getMyReviewsApi } from '@repositories/user/myPage';
import { useLoginUserStore } from '@store/login';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import ReviewComp from '@components/map/review';

const mypage = () => {
  const router = useRouter();
  const { nickName } = useLoginUserStore();
  const [reviewList, setReviewList] = useState<[] | null>(null);

  const getMyReviews = useCallback(async () => {
    const response = await getMyReviewsApi(3);
    if (response.success) {
      setReviewList(response.result.reviewList);
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      getMyReviews;
    }
  }, [router]);

  return (
    <article className={`text-[#F2F2F2]`}>
      <BasicHeader type={'back'} text={'My page'} onClickEvent={() => router.push('/map')} />
      <section>
        <section>
          <div>
            <div>유저 리얼 사진</div>
            <div>{nickName}</div>
          </div>
          <div>내가 쓴 리뷰</div>
        </section>
        <section>
          {reviewList &&
            reviewList.map((review) => (
              <ReviewComp name={review.name} score={review.score} review={review} />
            ))}
        </section>
      </section>
    </article>
  );
};

export default mypage;
