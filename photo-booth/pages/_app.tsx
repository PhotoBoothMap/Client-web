import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import type { AppProps } from 'next/app';

import { GlobalLayout } from '@styles/common/Layout';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';

declare global {
  // Kakao 함수를 전역에서 사용할 수 있도록 선언
  interface Window {
    Kakao: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const kakaoInit = () => {
    // 페이지가 로드되면 실행
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY);
  };

  return (
    <>
      <GlobalLayout>
        {/* <Hamburger></Hamburger> */}
        <Head>
          <meta name="naver-site-verification" content="c417466997957662e9c98d001fa95c13b4f4eb20" />
        </Head>
        <Component {...pageProps} />
        <Script src="https://developers.kakao.com/sdk/js/kakao.js" onLoad={kakaoInit}></Script>
      </GlobalLayout>
    </>
  );
}

export default MyApp;
