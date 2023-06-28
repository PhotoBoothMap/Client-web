import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useBoothStore } from '@store/booth';
import { useMapStore } from '@store/map';

import { mapRepository } from '@repositories/map';
import { Coordinate } from '@utils/interface/basic';
import { BoothPreview, PhotoBooth, photoBooth } from '@utils/interface/photoBooth';

import { boothRepository } from '@repositories/booth';
import { debounce } from 'lodash';
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

const testBooth = {
  boothDetail: {
    id: 3,
    brand: photoBooth.포토그레이,
    name: '테스트 네임',
    address: '서울 강남구 강남대로 102길 31 1층 4호',
    score: 4.2,
    reviewNum: 10,
    coordinate: {
      lat: 30,
      lng: 30,
    },
  },
  userTags: {
    '소품이 다양해요': 82,
    '사진이 잘 나와요': 65,
    '시설이 깔끔해요': 27,
  },
  review: [],
};

export default function Map() {
  /* prettier-ignore */
  const [userCor, setUserCor] = useMapStore((state) => [state.initialPosition, state.setInitialPostion]);
  const [curCor, setCurCor] = useMapStore((state) => [state.curPosition, state.setCurPosition]);
  const boothFilters = useBoothStore((state) => state.boothFilters);
  const [isGettingMarker, setIsGettingMarker] = useBoothStore((state) => [
    state.isGettingMarker,
    state.setIsGettingMarker,
  ]);

  const [curBoothDetail, setCurBoothDetail] = useState<PhotoBooth | null>(null);
  const [boothDetailUp, setBoothDetailUp] = useState<boolean>(false);

  const [curLevel, setCurLevel] = useState<number | null>(null);
  const [curBoundDistance, setCurBoundDistance] = useState<number>(Number.POSITIVE_INFINITY);
  const [curSearchType, setCurSearchType] = useState<searchType | null>(searchType.지역);
  const [curMarkers, setCurMarkers] = useState<Array<any>>([]);

  const [curBoothPreviews, setCurBoothPreviews] = useBoothStore((state) => [
    state.curBoothPreviews,
    state.setCurBoothPreviews,
  ]);

  const curPreviews = useRef<any>(0);

  const ref = useRef<any>(null);
  const curMap = useRef<any>(null);
  const curMoveFunctionRef = useRef<any>(null);

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
    setCurLevel(5);
  }, [curMap.current]);

  const getDistanceByCor = (cor1: Coordinate, cor2: Coordinate) => {
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
  };

  const getDistanceByLatLng = (cor1: any, cor2: any) => {
    if (curMap.current === null) return;
    const linePath = [cor1, cor2];
    const polyline = new window.kakao.maps.Polyline({
      map: curMap.current,
      path: linePath,
      strokeOpacity: 0,
    });
    return polyline.getLength();
  };

  // 마커 등록
  const setMarkers = (id: number, boothName: photoBooth, latLng: Coordinate) => {
    let boothIcon;
    switch (boothName) {
      case photoBooth.하루필름:
        boothIcon = '/image/blue_mark_map.png';
        break;

      case photoBooth.포토이즘:
        boothIcon = '/image/yellow_mark_map.png';
        break;

      case photoBooth.포토매틱:
        boothIcon = '/image/red_mark_map.png';
        break;

      case photoBooth.포토그레이:
        boothIcon = '/image/grey_mark_map.png';
        break;

      case photoBooth.인생네컷:
        boothIcon = '/image/pink_mark_map.png';
        break;

      case photoBooth.셀픽스:
        boothIcon = '/image/green_mark_map.png';
        break;

      case photoBooth.기타:
        boothIcon = '/image/darkgrey_mark_map.png';
        break;
    }

    const markerPosition = new window.kakao.maps.LatLng(latLng.lat, latLng.lng);

    const icon = new window.kakao.maps.MarkerImage(boothIcon, new window.kakao.maps.Size(30, 30), {
      offset: new window.kakao.maps.Point(16, 34),
      coords: '1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33',
    });

    const marker = new window.kakao.maps.Marker({
      title: id,
      position: markerPosition,
      // image: icon,
    });

    marker.setMap(curMap.current);

    window.kakao.maps.event.addListener(marker, 'click', async () => {
      const response = await boothRepository.getBooth(id!);
      setCurBoothDetail(response ?? testBooth);
      setBoothDetailUp(true);
    });

    return marker;
  };

  const getMarkersByCor = async (centerCor: Coordinate, neCor: Coordinate) => {
    const response = await mapRepository.getMarkers(centerCor, neCor, boothFilters);
    const markerList: Array<any> = [];
    response?.forEach((booth) => {
      const { id, brand, coordinate } = booth;
      const curMarker = setMarkers(id, brand, coordinate);
      markerList.push(curMarker);
    });
    setCurMarkers(markerList);
  };

  const searchByBooth = useCallback(async (keyword: string) => {
    const bounds = curMap.current.getBounds();
    const curCor = curMap.current.getCenter();
    const neCor = bounds.getNorthEast();
    const response = await mapRepository.searchBooth(curCor, neCor, keyword);
  }, []);

  const searchByPlace = (keyword: string) => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, async (data: any, status: any, pagination: any) => {
      if (window.kakao.maps.services.Status.OK) {
        let lngSum = 0;
        let latSum = 0;
        let cnt = 0;
        for (let position of data) {
          lngSum += Number.parseFloat(position.x);
          latSum += Number.parseFloat(position.y);
          cnt += 1;
        }

        const latAvg = latSum / cnt;
        const lngAvg = lngSum / cnt;

        await curMap.current.setCenter(new window.kakao.maps.LatLng(latAvg, lngAvg));

        const bounds = curMap.current.getBounds();

        const curCor = curMap.current.getCenter();
        const neCor = bounds.getNorthEast();

        await getMarkersByCor(latLngConstructor(curCor), latLngConstructor(neCor));

        getMarkersByCor(latLngConstructor(curCor), latLngConstructor(neCor));
        setCurCor(curCor);
      } else {
      }
    });
  };

  // 줌 in,out 시 bound 거리 다시 계산
  useEffect(() => {
    if (curMap.current === null) return;
    const centerLatLng = (curMap.current as any).getCenter();
    const bounds = (curMap.current as any).getBounds();
    const neLatLng = bounds.getNorthEast();
    const boundDistance = getDistanceByLatLng(centerLatLng, neLatLng);
    setCurBoundDistance(boundDistance);
    getMarkers();
  }, [curMap.current, curLevel]);

  const centerChangeEvent = useCallback(
    debounce(() => {
      console.log('is debounced');
      if (isGettingMarker) return;

      const map = curMap.current as any;
      const latLng = map.getCenter();
      const curDistance = getDistanceByCor(latLngConstructor(latLng), curCor);
      if (curDistance >= curBoundDistance && !isGettingMarker) {
        setIsGettingMarker(true);
      }
    }, 300),
    [curMap.current, isGettingMarker, curCor, curBoundDistance],
  );

  async function getMarkers() {
    const map = curMap.current as any;
    const latLng = map.getCenter();
    curMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    const bounds = (map as any).getBounds();
    const neLatLng = bounds.getNorthEast();
    try {
      await getMarkersByCor(latLngConstructor(latLng), latLngConstructor(neLatLng));
      await getPreviews([]);
      curPreviews.current = 0;
    } catch (e) {
      console.log(e);
    } finally {
      setCurCor(latLngConstructor(latLng));
    }
  }

  const getPreviews = useCallback(
    async (curBooth: BoothPreview[]) => {
      if (curMap.current === null) return;
      const previews = await mapRepository.getBoothList(curCor, curPreviews.current, boothFilters);
      console.log([previews]);
      setCurBoothPreviews([...curBooth, ...previews]);
      curPreviews.current += 10;
    },
    [curCor, curPreviews.current, Array.from(boothFilters).length],
  );

  // 이동시에 일정 거리 이동시 부스 정보 업데이트
  useEffect(() => {
    if (curMap.current === null || isGettingMarker) {
      return;
    }

    console.log('is center change event changed');

    const curMoveFunction = curMoveFunctionRef.current;

    if (curMoveFunction !== null) {
      window.kakao.maps.event.removeListener(curMap.current, 'center_changed', curMoveFunction);
    }

    window.kakao.maps.event.addListener(curMap.current, 'center_changed', centerChangeEvent);
    curMoveFunctionRef.current = centerChangeEvent;
  }, [curMap.current, centerChangeEvent]);

  useEffect(() => {
    if (curMap.current === null) return;
    async function toAsync(fn: any) {
      await fn();
    }
    toAsync(getMarkers);
  }, [curMap.current, Array.from(boothFilters).length]);

  useEffect(() => {
    if (!isGettingMarker) return;
    console.log('is getting marker');
    async function toAsync(fn: any) {
      await fn();
      setIsGettingMarker(false);
    }

    toAsync(getMarkers);
  }, [curMap.current, isGettingMarker, getMarkers]);

  return (
    <Wrapper>
      <MapHeader
        curSearchType={curSearchType}
        setCurSearchType={setCurSearchType}
        searchByPlace={searchByPlace}
      />
      <MapWrapper ref={ref!} />
      <PreviewsWrapper
        setCurBoothDetail={setCurBoothDetail}
        setBoothDetailUp={setBoothDetailUp}
        getPreviews={getPreviews}
      />
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
  height: 100vh;
  overflow: hidden;
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
