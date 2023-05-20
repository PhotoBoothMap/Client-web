import { SocialLoginButtonStyle } from '@styles/common/ButtonStyle';
import Image from 'next/image';
import React from 'react';

interface socialLoginButtonInterface {
  type: 'kakao' | 'google';
  onClickEvent: () => void;
}

const SocialLoginButton = ({ type, onClickEvent }: socialLoginButtonInterface) => {
  return (
    <SocialLoginButtonStyle
      size={'large'}
      color={type === 'kakao' ? 'yellow' : 'white'}
      onClick={() => onClickEvent()}
    >
      <Image
        src={`/common/${type}-logo.svg`}
        width={20}
        height={20}
        alt={`${type} login`}
        className={` absolute left-[1.1875rem]`}
      ></Image>
      <div>{type === 'kakao' ? '카카오 로그인' : '구글 로그인'}</div>
    </SocialLoginButtonStyle>
  );
};

export default SocialLoginButton;
