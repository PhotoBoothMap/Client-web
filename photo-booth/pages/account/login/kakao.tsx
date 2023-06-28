import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI, kakaoLoginApi } from '@repositories/login/auth';
import { useLoginUserStore } from '@store/login';

const kakaoLoginPage = () => {
  const router = useRouter();
  const { code: authCode, error: kakaoServerError } = router.query;
  const { setNickName, setProfile, setId } = useLoginUserStore();

  const loginHandler = useCallback(
    async (code: string) => {
      const response = await kakaoLoginApi(code);
      const accessToken = response.headers.get('Authorization');
      authAPI.defaults.headers.common['Authorization'] = `${accessToken}`;
      // setRefreshTokenCookie(response.headers.get('refresh-token'));

      if (response.data.success) {
        setId(response.data.result.userId);
        setNickName(response.data.result.nickname);
        setProfile(response.data.result.profileImageUrl);

        router.push('/map');
      } else {
        // 실패하면 에러 페이지로 리다이렉트
        router.push('/notifications/authentication-failed');
      }
    },
    [router],
  );

  useEffect(() => {
    if (authCode && typeof authCode === 'string') {
      loginHandler(authCode);
      // 인가코드를 제대로 못 받았을 경우에 에러 페이지를 띄운다.
    } else if (kakaoServerError) {
      router.push('/notifications/authentication-failed');
    }
  }, [authCode, kakaoServerError, router]);

  return <></>;
};

export default kakaoLoginPage;
