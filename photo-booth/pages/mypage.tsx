import BasicHeader from '@components/common/header/BasicHeader';
import ReviewComp from '@components/map/review';
import { logoutApi } from '@repositories/login/auth';
import { getMyReviewsApi } from '@repositories/user/myPage';
import { useLoginUserStore } from '@store/login';
import { tagKey } from '@utils/interface/photoBooth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

type reviewType = {
  starRate: number;
  boothName: string;
  date: string;
  imageUrls: string[];
  userTags: tagKey[];
  content: string;
};

const mypage = () => {
  const router = useRouter();
  const user = useLoginUserStore();
  const [reviewList, setReviewList] = useState<reviewType[] | null>(null);

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const getMyReviews = useCallback(async () => {
    const response = await getMyReviewsApi();
    if (response.success) {
      setReviewList(response.result.reviewList);
    }
  }, []);

  useEffect(() => {
    if (router.isReady && hydrated) {
      if (user.id) {
        getMyReviews();
        // console.log(user);
      } else {
        alert('로그인이 필요한 서비스입니다.');
        router.push('/account/login');
      }
    }
  }, [router, hydrated]);

  const logout = useCallback(async () => {
    const response = await logoutApi();
    if (response.success) {
      user.resetLoginUser();
      router.push('/map');
    }
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  } else
    return (
      <article className={`text-[#F2F2F2]`}>
        <BasicHeader
          type={'back'}
          text={'My page'}
          onClickEvent={() => router.push('/map')}
          rightElement={
            <div onClick={() => logout()} className={`cursor-pointer font-normal text-sm`}>
              로그아웃
            </div>
          }
        />
        <section>
          <section>
            <div className={`flex flex-col items-center gap-2 p-4`}>
              <Image src={'/common/user-logo.svg'} alt="" width="80" height={80} />
              {user && <div className={`text-lg font-semibold`}>{user.nickName ?? '-'}</div>}
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
                reviewList.map((review) => {
                  if (typeof user.nickName === 'string') {
                    const _review = {
                      user: user.nickName,
                      date: review.date,
                      content: review.content,
                      score: review.starRate,
                      imgUrl: review.imageUrls,
                      brand: review.boothName,
                      name: user.nickName,
                      userTags: review.userTags,
                    };
                    return (
                      <ReviewComp name={user.nickName} score={review.starRate} review={_review} />
                    );
                  }
                })}
            </div>
          </section>
        </section>
      </article>
    );
};

export default mypage;
