import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useMapStore } from '@store/map';

export default function Map() {
  /* prettier-ignore */
  const [userCor, setUserCor] = useMapStore((state) => [state.initialPosition, state.setInitialPostion]);
  const [curCor, setCurCor] = useMapStore((state) => [state.curPosition, state.setCurPosition]);
  const ref = useRef(null);
  const curMap = useRef(null);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      window.kakao.maps.load(() => {
        const container = ref.current;
        const options = {
          center: new window.kakao.maps.LatLng(curCor.lat, curCor.long),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        curMap.current = map;
      });
    });
  }, []);

  return (
    <Wrapper>
      <MapWrapper ref={ref} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  flex-grow: 1;
`;

const MapWrapper = styled.div``;

const Button = styled.button`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
`;
