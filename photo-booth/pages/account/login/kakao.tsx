import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { setRTCookie } from '@repositories/login/auth';
import { kakaoLoginApi, validateApi } from '@repositories/login/socialLogin';

const kakaoLoginPage = () => {
  const router = useRouter();
  const { code: authCode, error: kakaoServerError } = router.query;

  const loginHandler = useCallback(
    async (code: string) => {
      //TODO utils로 빼기
      // const response = await axios

      const response = await kakaoLoginApi(code);

      if (response.data.success) {
        const cookie = response.headers.cookie;

        setRTCookie(cookie);

        // 성공하면 validation 체크하기
        const validationResponse = await validateApi(response.header.Authorization);

        if (validationResponse.data.success) {
          // 성공하면 홈으로 리다이렉트
          router.push('/');
        }
      } else {
        // 실패하면 에러 페이지로 리다이렉트
        router.push('/notifications/authentication-failed');
      }
    },
    [router],
  );

  useEffect(() => {
    if (authCode) {
      loginHandler(authCode);
      // 인가코드를 제대로 못 받았을 경우에 에러 페이지를 띄운다.
    } else if (kakaoServerError) {
      router.push('/notifications/authentication-failed');
    }
  }, [authCode, kakaoServerError, router]);

  return (
    <div className={`bg-white`}>
      <h2>로그인 중입니다..</h2>
    </div>
  );
};

export default kakaoLoginPage;
