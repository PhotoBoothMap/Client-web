import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { GlobalLayout } from '@styles/common/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalLayout>
        <Component {...pageProps} />
      </GlobalLayout>
    </>
  );
}

export default MyApp;
