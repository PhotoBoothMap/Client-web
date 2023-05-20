import React from 'react';
import Image from 'next/image';
import SocialLoginButton from '@components/common/button/SocialLoginButton';

const loginPage = () => {
  // 등록한 redirectUri를 매개변수로 넣어준다.
  const kakaoLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: `${process.env.NEXT_PUBLIC_HOST}/account/login/kakao`,
    });
  };

  return (
    <section
      className={` flex flex-col items-center justify-center h-screen gap-[13.1875rem] my-auto`}
    >
      <div>
        <Image src={'/common/logo.svg'} alt="여기사진 로고" width={150} height={150}></Image>
      </div>
      <div className={`flex flex-col items-center`}>
        <div className={`flex w-full items-start mb-5 text-[#F2F2F2] text-xl font-semibold`}>
          간편 로그인
        </div>
        <div className={`flex flex-col gap-2`}>
          <SocialLoginButton
            type={'kakao'}
            onClickEvent={() => {
              console.log('kakao');
              kakaoLogin();
            }}
          />
          <SocialLoginButton
            type={'google'}
            onClickEvent={() => {
              console.log('google');
            }}
          />
        </div>
        <div
          className={`mt-6 text-[#FFFFFF] font-medium text-sm opacity-[0.85] underline cursor-pointer`}
          style={{ textUnderlinePosition: 'under' }}
        >
          로그인 없이 둘러볼게요.
        </div>
      </div>
    </section>
  );
};
2;

export default loginPage;
