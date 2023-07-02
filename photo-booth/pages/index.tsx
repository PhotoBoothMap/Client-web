import { useRouter } from 'next/router';

import type { NextPage } from 'next';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const navigation = useRouter();

  useEffect(() => {
    navigation.push('/map');
  }, []);

  return (
    <div className={styles.container}>
      PHOTO BOOTH
      <style global jsx>
        {`
          html,
          body,
          body > div:first-child,
          div#__next,
          div#__next > div {
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
