import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useBoothStore } from '@store/booth';
import { useMapStore } from '@store/map';

import { mapRepository } from '@repositories/map';
import { Coordinate } from '@utils/interface/basic';
import { PhotoBooth, photoBooth } from '@utils/interface/photoBooth';

import markBluedMap from '@image/blue_mark_map.png';
import markDarkGreyMap from '@image/darkgrey_mark_map.png';
import markGreenMap from '@image/green_mark_map.png';
import markGreyMap from '@image/grey_mark_map.png';
import markPinkMap from '@image/pink_mark_map.png';
import markRedMap from '@image/red_mark_map.png';
import markYellowMap from '@image/yellow_mark_map.png';

import { useState } from 'react';
import BoothDetailPop from '../boothDetailPop';
import MapHeader from '../header';
import PreviewsWrapper from '../previewsWrapper';

function latLngConstructor(kakaoLatLng: any) {
  return {
    lat: kakaoLatLng.getLat() as number,
    lng: kakaoLatLng.getLng() as number,
  };
}

export enum searchType {
  부스 = '부스',
  지역 = '지역',
}

export default function Map() {
  /* prettier-ignore */
  const [userCor, setUserCor] = useMapStore((state) => [state.initialPosition, state.setInitialPostion]);
  const [curCor, setCurCor] = useMapStore((state) => [state.curPosition, state.setCurPosition]);
  const boothFilters = useBoothStore((state) => state.boothFilters);

  const [curBoothDetail, setCurBoothDetail] = useState<PhotoBooth | null>(null);
  const [boothDetailUp, setBoothDetailUp] = useState<boolean>(false);

  const [curLevel, setCurLevel] = useState<number>(3);
  const [curBoundDistance, setCurBoundDistance] = useState<number>(Number.POSITIVE_INFINITY);
  const [curSearchType, setCurSearchType] = useState<searchType | null>(null);
  const [curMarkers, setCurMarkers] = useState<Array<any>>([]);

  const ref = useRef<any>(null);
  const curMap = useRef<any>(null);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_APPKEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.addEventListener('load', () => {
      window.kakao.maps.load(() => {
        const container = ref.current;
        const options = {
          center: new window.kakao.maps.LatLng(curCor.lat, curCor.lng),
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
        new window.kakao.maps.LatLng(cor1.lat, cor1.lng),
        new window.kakao.maps.LatLng(cor2.lat, cor2.lng),
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

  // 마커 등록
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

      const markerPosition = new window.kakao.maps.LatLng(latLng.lat, latLng.lng);

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

      return marker;
    },

    [curMap.current],
  );

  const getMarkersByCor = useCallback(
    async (centerCor: Coordinate, neCor: Coordinate) => {
      const response = await mapRepository.getMarkers(centerCor, neCor, boothFilters);
      const markerList: Array<any> = [];
      response?.forEach((booth) => {
        const { id, brand, coordinate } = booth;
        const curMarker = setMarkers(id!, brand!, coordinate!);
        markerList.push(curMarker);
      });
      setCurMarkers(markerList);
    },
    [boothFilters],
  );

  const searchByPlace = useCallback((keyword: string) => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: any, status: any, pagination: any) => {
      if (window.kakao.maps.services.Status.OK) {
        let bounds = new window.kakao.map.LatLngBounds();
        for (let position of data) {
          bounds.extend(window.kakao.LatLng(position.y, position.x));
        }
        curMap.current.setBounds(bounds);
        const curCor = curMap.current.getCenter();
        const neCor = bounds.getNorthEast();
        getMarkersByCor(latLngConstructor(curCor), latLngConstructor(neCor));
        setCurCor(curCor);
      } else {
      }
    });
  }, []);

  // 줌 in,out 시 bound 거리 다시 계산
  useEffect(() => {
    if (curMap.current === null) return;
    const centerLatLng = (curMap.current as any).getCenter();
    const bounds = (curMap.current as any).getBounds();
    const neLatLng = bounds.getNorthEast();
    const boundDistance = getDistanceByLatLng(centerLatLng, neLatLng);
    setCurBoundDistance(boundDistance);
  }, [curMap.current, curLevel]);

  // 이동시에 일정 거리 이동시 부스 정보 업데이트
  useEffect(() => {
    if (curMap.current === null) {
      return;
    }

    window.kakao.maps.event.addListener(curMap.current, 'center_changed', async () => {
      const map = curMap.current as any;
      const latLng = map.getCenter();
      const curDistance = getDistanceByCor(latLngConstructor(latLng), curCor);
      if (curDistance >= curBoundDistance) {
        //기존 마커 제거
        curMarkers.forEach((marker) => {
          marker.setMap(null);
        });

        const bounds = (map as any).getBounds();
        const neLatLng = bounds.getNorthEast();
        getMarkersByCor(latLngConstructor(latLng), latLngConstructor(neLatLng));
        setCurCor(latLngConstructor(latLng));
      }
    });
  }, [curMap.current, curCor, curBoundDistance]);

  return (
    <Wrapper>
      <MapHeader
        curSearchType={curSearchType}
        setCurSearchType={setCurSearchType}
        searchByPlace={searchByPlace}
      />
      <MapWrapper ref={ref!} />
      <PreviewsWrapper setCurBoothDetail={setCurBoothDetail} setBoothDetailUp={setBoothDetailUp} />
      <BoothDetailPop
        state={boothDetailUp}
        boothInfo={curBoothDetail}
        setCurBoothDetail={setCurBoothDetail}
        setBoothDetailUp={setBoothDetailUp}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
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
