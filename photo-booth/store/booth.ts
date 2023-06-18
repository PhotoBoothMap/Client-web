import { BoothMarker, BoothPreview, photoBooth } from '@utils/interface/photoBooth';
import { toggleSet } from '@utils/tools/BasicUtils';
import { create } from 'zustand';

interface BoothState {
  /** 마커 정보 */
  curBoothMakers: BoothMarker[];
  /** 부스 리스트에 뜨게 될 정보 */
  curBoothPreviews: BoothPreview[];
  /** 부스 필터링 */
  boothFilters: Set<photoBooth>;
  //** 부스 받아오는 중.. */
  isGettingMarker: boolean;
}

interface BoothAction {
  setCurBoothMakers: (boothMarkers: BoothMarker[]) => void;
  setCurBoothPreviews: (boothPreviews: BoothPreview[]) => void;
  toggleFilter: (photoBooth: photoBooth) => void;
  setIsGettingMarker: (state: boolean) => void;
}

export const useBoothStore = create<BoothState & BoothAction>((set) => ({
  curBoothMakers: [],
  curBoothPreviews: [
    {
      id: 0,
      brand: photoBooth.인생네컷,
      name: '테스트 이름',
      distance: 500,
      address: '서울 강남구 강남대로102길 31 1층 4호',
      score: 4.5,
      reviewNum: 16,
    },
    {
      id: 1,
      brand: photoBooth.인생네컷,
      name: '테스트 이름',
      distance: 500,
      address: '서울 강남구 강남대로102길 31 1층 4호',
      score: 4.5,
      reviewNum: 16,
    },
  ],
  boothFilters: new Set([...(Object.keys(photoBooth) as Array<photoBooth>)]),
  isGettingMarker: false,
  setCurBoothMakers: (boothMarkers: BoothMarker[]) => {
    set(() => ({ curBoothMakers: boothMarkers }));
  },
  setCurBoothPreviews: (boothPreviews: BoothPreview[]) => {
    set(() => ({ curBoothPreviews: boothPreviews }));
  },
  toggleFilter: (photoBooth: photoBooth) => {
    set((state) => {
      return {
        boothFilters: toggleSet(state.boothFilters, photoBooth),
      };
    });
  },
  setIsGettingMarker: (state: boolean) => {
    set(() => ({
      isGettingMarker: state,
    }));
  },
}));
