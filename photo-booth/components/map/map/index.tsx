import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useBoothStore } from '@store/booth';
import { useMapStore } from '@store/map';

import { mapRepository } from '@repositories/map';
import { Coordinate } from '@utils/interface/basic';
import { photoBooth } from '@utils/interface/photoBooth';

import markBluedMap from '@image/blue_mark_map.png';
import markDarkGreyMap from '@image/darkgrey_mark_map.png';
import markGreenMap from '@image/green_mark_map.png';
import markGreyMap from '@image/grey_mark_map.png';
import markPinkMap from '@image/pink_mark_map.png';
import markRedMap from '@image/red_mark_map.png';
import markYellowMap from '@image/yellow_mark_map.png';

import { useState } from 'react';
import MapHeader from '../header';
import PreviewsWrapper from '../previewsWrapper';

function latLngConstructor(kakaoLatLng: any) {
  return {
    lat: kakaoLatLng.getLat() as number,
    long: kakaoLatLng.getLng() as number,
  };
}

export enum searchType {
  부스 = "부스",
  지역 = "지역"
}

export default function Map() {
  /* prettier-ignore */
  const [userCor, setUserCor] = useMapStore((state) => [state.initialPosition, state.setInitialPostion]);
  const [curCor, setCurCor] = useMapStore((state) => [state.curPosition, state.setCurPosition]);
  const boothFilters = useBoothStore((state) => state.boothFilters);

  const [curLevel, setCurLevel] = useState<number>(3);
  const [curBoundDistance, setCurBoundDistance] = useState<number>(Number.POSITIVE_INFINITY);
  const [curSearchType, setCurSearchType] = useState<searchType | null>(null);

  const ref = useRef<any>(null);
  const curMap = useRef<any>(null);

  useEffect(() => {
    if (ref.current === null) {
      console.log('hereh');
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

  useEffect(() => {
    if (curMap.current == null) return;
    window.kakao.maps.event.addListener(curMap.current, 'zoom_changed', () => {
      var level = (curMap.current as any).getLevel();
      setCurLevel(level);
    });
  }, [curMap.current]);

  const getDistanceByCor = useCallback(
    (cor1: Coordinate, cor2: Coordinate) => {
      if (curMap.current === null) return;
      const linePath = [
        new window.kakao.maps.LatLng(cor1.lat, cor1.long),
        new window.kakao.maps.LatLng(cor2.lat, cor2.long),
      ];
      const polyline = new window.kakao.maps.Polyline({
        map: curMap.current,
        path: linePath,
        strokeOpacity: 0,
      });
      return polyline.getLength();
    },
    [curMap.current],
  );

  const getDistanceByLatLng = useCallback(
    (cor1: any, cor2: any) => {
      if (curMap.current === null) return;
      const linePath = [cor1, cor2];
      const polyline = new window.kakao.maps.Polyline({
        map: curMap.current,
        path: linePath,
        strokeOpacity: 0,
      });
      return polyline.getLength();
    },
    [curMap.current],
  );

  const setMarkers = useCallback(
    (id: number, boothName: photoBooth, latLng: Coordinate) => {
      let boothIcon;
      switch (boothName) {
        case photoBooth.하루필름:
          boothIcon = markBluedMap;
          break;
        case photoBooth.포토이즘:
          boothIcon = markYellowMap;
          break;
        case photoBooth.포토매틱:
          boothIcon = markRedMap;
          break;
        case photoBooth.포토그레이:
          boothIcon = markGreyMap;
          break;
        case photoBooth.인생네컷:
          boothIcon = markPinkMap;
          break;
        case photoBooth.셀픽스:
          boothIcon = markGreenMap;
          break;
        case photoBooth.기타:
          boothIcon = markDarkGreyMap;
          break;
      }

      const markerPosition = new window.kakao.maps.LatLng(latLng.lat, latLng.long);

      const icon = new window.kakao.maps.MarkerImage(
        boothIcon,
        new window.kakao.maps.Size(30, 30),
        {
          offset: new window.kakao.maps.Point(16, 34),
          coords: '1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33',
        },
      );
      const marker = new window.kakao.maps.Marker({
        title: id,
        position: markerPosition,
        image: icon,
      }).setMap(curMap.current);

      new window.kakao.maps.event.addListener(marker, 'click', () => {});
    },
    [curMap.current],
  );

  useEffect(() => {
    if (curMap.current === null) return;

    const centerLatLng = (curMap.current as any).getCenter();
    const bounds = (curMap.current as any).getBounds();
    const neLatLng = bounds.getNorthEast();
    const boundDistance = getDistanceByLatLng(centerLatLng, neLatLng);
    setCurBoundDistance(boundDistance);
  }, [curMap.current, curLevel]);

  useEffect(() => {
    if (curMap.current === null) {
      return;
    }

    window.kakao.maps.event.addListener(curMap.current, 'center_changed', async () => {
      const map = curMap.current as any;
      const latLng = map.getCenter();
      const curDistance = getDistanceByCor(latLngConstructor(latLng), curCor);
      if (curDistance >= curBoundDistance) {
        const bounds = (map as any).getBounds();
        const neLatLng = bounds.getNorthEast();
        const response = await mapRepository.getMarkers(
          latLngConstructor(latLng),
          latLngConstructor(neLatLng),
          boothFilters,
        );
        response?.forEach((booth) => {
          const { id, brand, coordinate } = booth;
          setMarkers(id!, brand!, coordinate!);
        });

        setCurCor(latLngConstructor(latLng));
      }
    });
  }, [curMap.current, curCor, curBoundDistance]);

  return (
    <Wrapper>
      <MapHeader curSearchType={curSearchType} setCurSearchType={setCurSearchType} />
      <MapWrapper ref={ref!} />
      <PreviewsWrapper />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  flex-grow: 1;
`;

const MapWrapper = styled.div`
  height: 100vh;
`;

const Button = styled.button`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
`;
