import styled from 'styled-components';

import { useCallback, useEffect, useState } from 'react';

import Map from '@components/map/map';
import { useMapStore } from '@store/map';
import { BoothPreview } from '@utils/interface/photoBooth';

export default function Main() {
  const setUserCor = useMapStore((state) => state.setInitialPostion);
  const setCurCor = useMapStore((state) => state.setCurPosition);

  const [boothNearest, setBoothNearest] = useState<BoothPreview[]>([]);

  const getCor = useCallback((position: GeolocationPosition) => {
    //현재 좌표 저장
    setCurCor({
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });

    // User 정보 저장
    setUserCor({
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
  }, []);

  const getUserCorErr = useCallback((err: GeolocationPositionError) => {
    console.log(err);
    return;
  }, []);

  // 관련 로직 util 로 빼기 애매해서 여기 뒀습니다.
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getCor, getUserCorErr);
  }, []);

  return (
    <Page>
      <Map />
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  position: relative;
`;
