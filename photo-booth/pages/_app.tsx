import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { GlobalLayout } from '@styles/common/Layout';
import Hamburger from '@components/common/Hamburger';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalLayout>
        <Hamburger></Hamburger>
        <Component {...pageProps} />
      </GlobalLayout>
    </>
  );
}

export default MyApp;
