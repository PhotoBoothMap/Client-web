import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useBoothStore } from '@store/booth';
import { useMapStore } from '@store/map';

import { mapRepository } from '@repositories/map';
import { Coordinate } from '@utils/interface/basic';
import { BoothPreview, PhotoBooth, photoBooth } from '@utils/interface/photoBooth';

import { defaultCor } from '@assets/const';
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
  브랜드 = '브랜드',
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
    tagNum: 200,
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
  const [curCor, setCurCor] = useMapStore((state) => [state.curPosition, state.setCurPosition]);
  const boothFilters = useBoothStore((state) => state.boothFilters);
  const [isGettingMarker, setIsGettingMarker] = useBoothStore((state) => [
    state.isGettingMarker,
    state.setIsGettingMarker,
  ]);

  const [isShowMap, setIsShowMap] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (ref.current === null || !isShowMap) {
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
          level: 5,
        };
        const map = new window.kakao.maps.Map(container, options);
        curMap.current = map;
        async function toAsync(fn: any) {
          await fn();
          setIsGettingMarker(false);
        }

        toAsync(getMarkers);
      });
    });
  }, [isShowMap]);

  useEffect(() => {
    if (curMap.current == null || !isShowMap) return;
    window.kakao.maps.event.addListener(
      curMap.current,
      'zoom_changed',
      debounce(() => {
        var level = (curMap.current as any).getLevel();
        setCurLevel(level);
        setIsGettingMarker(true);
      }, 500),
    );
    setCurLevel(5);
  }, [curMap.current, isShowMap]);

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
        boothIcon = 'image/yellow_mark_map.png';
        break;

      case photoBooth.모노맨션:
        boothIcon = 'image/orange_mark_map.png';
        break;

      case photoBooth.포토시그니처:
        boothIcon = 'image/purple_mark_map.png';
        break;

      case photoBooth.포토그레이:
        boothIcon = 'image/grey_mark_map.png';
        break;

      case photoBooth.인생네컷:
        boothIcon = 'image/pink_mark_map.png';
        break;

      case photoBooth.셀픽스:
        boothIcon = 'image/green_mark_map.png';
        break;

      default:
        boothIcon = 'image/white_mark_map.png';
        break;
    }

    const markerPosition = new window.kakao.maps.LatLng(latLng.lat, latLng.lng);

    const icon = new window.kakao.maps.MarkerImage(
      `${process.env.NEXT_PUBLIC_HOST}${boothIcon}`,
      new window.kakao.maps.Size(35, 45),
      {
        offset: new window.kakao.maps.Point(16, 34),
        coords: '1,20,1,9,5,2,10,0,21,0,27,3,30,9,30,20,17,33,14,33',
      },
    );

    const marker = new window.kakao.maps.Marker({
      title: `${boothName}${id}`,
      position: markerPosition,
      image: icon,
    });

    marker.setMap(curMap.current);

    window.kakao.maps.event.addListener(marker, 'click', async () => {
      const response = await boothRepository.getBooth(id!);
      setCurBoothDetail(response ?? testBooth);
      // setCurBoothDetail(testBooth);
      setBoothDetailUp(true);
    });

    return marker;
  };

  const getMarkersByCor = async (centerCor: Coordinate, neCor: Coordinate) => {
    const response = await mapRepository.getMarkers(centerCor, neCor, boothFilters);
    curMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    const markerList: Array<any> = [];
    response?.forEach((booth) => {
      const { id, brand, coordinate } = booth;
      const curMarker = setMarkers(id, brand, coordinate);
      markerList.push(curMarker);
    });
    setCurMarkers(markerList);
  };

  const searchByBooth = async (keyword: string) => {
    const bounds = curMap.current.getBounds();
    const curCor = curMap.current.getCenter();
    const neCor = bounds.getNorthEast();
    const response = await mapRepository.searchBooth(
      latLngConstructor(curCor),
      latLngConstructor(neCor),
      keyword,
    );
    curMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    const markerList: Array<any> = [];
    response.forEach((booth) => {
      const { id, brand, coordinate } = booth;
      const curMarker = setMarkers(id, brand, coordinate);
      markerList.push(curMarker);
    });
    setCurMarkers(markerList);
  };

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
    if (curMap.current === null || !isShowMap) return;

    const centerLatLng = (curMap.current as any).getCenter();
    const bounds = (curMap.current as any).getBounds();
    const neLatLng = bounds.getNorthEast();
    const boundDistance = getDistanceByLatLng(centerLatLng, neLatLng);
    setCurBoundDistance(boundDistance);
  }, [curLevel, isShowMap]);

  const centerChangeEvent = useCallback(
    debounce(() => {
      if (isGettingMarker) return;
      const map = curMap.current as any;
      const latLng = map.getCenter();
      const curDistance = getDistanceByCor(latLngConstructor(latLng), curCor);
      if (curDistance >= curBoundDistance && !isGettingMarker) {
        setIsGettingMarker(true);
      }
    }, 500),
    [curMap.current, isGettingMarker, curCor.lat, curCor.lng, curBoundDistance],
  );

  async function getMarkers() {
    const map = curMap.current as any;
    const latLng = map.getCenter();
    curMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    const bounds = (map as any).getBounds();
    const neLatLng = bounds.getNorthEast();
    curPreviews.current = 0;
    try {
      await getMarkersByCor(latLngConstructor(latLng), latLngConstructor(neLatLng));
      await getPreviews([]);
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
      setCurBoothPreviews([...curBooth, ...previews]);
      curPreviews.current += 10;
    },
    [curCor, curPreviews.current, Array.from(boothFilters).length],
  );

  // 이동시에 일정 거리 이동시 부스 정보 업데이트
  useEffect(() => {
    if (curMap.current === null || isGettingMarker || !isShowMap) {
      return;
    }

    const curMoveFunction = curMoveFunctionRef.current;

    if (curMoveFunction !== null) {
      window.kakao.maps.event.removeListener(curMap.current, 'center_changed', curMoveFunction);
    }

    window.kakao.maps.event.addListener(curMap.current, 'center_changed', centerChangeEvent);
    curMoveFunctionRef.current = centerChangeEvent;
  }, [curMap.current, centerChangeEvent, isShowMap]);

  useEffect(() => {
    if (curMap.current === null || !isShowMap) return;
    async function toAsync(fn: any) {
      await fn();
    }
    toAsync(getMarkers);
  }, [curMap.current, Array.from(boothFilters).length, isShowMap]);

  useEffect(() => {
    if (curMap.current === null || !isGettingMarker || !isShowMap) return;

    async function toAsync(fn: any) {
      await fn();
      setIsGettingMarker(false);
    }

    toAsync(getMarkers);
  }, [curMap.current, isGettingMarker]);

  const getMyGps = () => {
    let gpsOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
    };

    return new Promise((resolve, rejected) => {
      navigator.geolocation.getCurrentPosition(resolve, rejected);
    });
  };

  useEffect(() => {
    async function toAsync(fn: any) {
      await fn();
    }
    toAsync(async () => {
      try {
        const position = (await getMyGps()) as any;
        setCurCor({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (e) {
        const defaultPosition = defaultCor();
        setCurCor(defaultPosition);
      } finally {
        setIsLoading(false);
        setIsShowMap(true);
      }
    });
  }, []);

  return (
    <Wrapper>
      <MapHeader
        curSearchType={curSearchType}
        setCurSearchType={setCurSearchType}
        searchByPlace={searchByPlace}
        searchByBooth={searchByBooth}
      />
      <MapWrapper ref={ref!} />
      <PreviewsWrapper
        setCurBoothDetail={setCurBoothDetail}
        setBoothDetailUp={setBoothDetailUp}
        getPreviews={getPreviews}
        getMarkers={getMarkers}
      />
      <BoothDetailPop
        state={boothDetailUp}
        boothInfo={curBoothDetail}
        setCurBoothDetail={setCurBoothDetail}
        setBoothDetailUp={setBoothDetailUp}
      />
      {isLoading || !isShowMap ? (
        <div role="status" className="loading">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <></>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  flex-grow: 1;
  & {
    div.loading {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      z-index: 9999;
      position: absolute;
      top: 0;
      left: 0;
      backdrop-filter: blur(12px);
    }
  }
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
