import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { GlobalLayout } from '@styles/common/Layout';
import Hamburger from '@components/common/Hamburger';
import Script from 'next/script';

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
    console.log(window.Kakao.isInitialized());
  };

  return (
    <>
      <GlobalLayout>
        <Hamburger></Hamburger>
        <Component {...pageProps} />
        <Script src="https://developers.kakao.com/sdk/js/kakao.js" onLoad={kakaoInit}></Script>
      </GlobalLayout>
    </>
  );
}

export default MyApp;
