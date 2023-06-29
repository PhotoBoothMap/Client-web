import BasicHeader from '@components/common/header/BasicHeader';
import { getMyReviewsApi } from '@repositories/user/myPage';
import { useLoginUserStore } from '@store/login';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import ReviewComp from '@components/map/review';
import Image from 'next/image';
import LogoBright from '@image/logo_bright.png';

const mypage = () => {
  const router = useRouter();
  const { nickName } = useLoginUserStore();
  const [reviewList, setReviewList] = useState<[] | null>(null);

  const getMyReviews = useCallback(async () => {
    const response = await getMyReviewsApi(id);
    if (response.success) {
      setReviewList(response.result.reviewList);
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      getMyReviews();
    }
  }, [router]);

  return (
    <article className={`text-[#F2F2F2]`}>
      <BasicHeader type={'back'} text={'My page'} onClickEvent={() => router.push('/map')} />
      <section>
        <section>
          <div className={`flex flex-col items-center gap-2 p-4`}>
            <Image src={LogoBright} alt="" width="80" />
            <div className={`text-lg font-semibold`}>{nickName}</div>
          </div>
          <div className={`p-4`}>
            <div
              className={`bg-[#2A2A2A] font-semibold flex items-center justify-center p-3 rounded-lg`}
            >
              내가 쓴 리뷰
            </div>
          </div>
        </section>
        <section className={`flex flex-col p-4`}>
          <div className={`w-full`}>
            {reviewList &&
              reviewList.map((review) => (
                <ReviewComp name={review.name} score={review.score} review={review} />
              ))}
          </div>
        </section>
      </section>
    </article>
  );
};

export default mypage;
