import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { GlobalLayout } from '@styles/common/Layout';
import type { AppProps } from 'next/app';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalLayout>
        {/* <Hamburger></Hamburger> */}
        <Component {...pageProps} />
      </GlobalLayout>
    </>
  );
}

export default MyApp;
