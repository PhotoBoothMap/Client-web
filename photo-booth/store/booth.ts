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
}

interface BoothAction {
  setCurBoothMakers: (boothMarkers: BoothMarker[]) => void;
  setCurBoothPreviews: (boothPreviews: BoothPreview[]) => void;
  toggleFilter: (photoBooth: photoBooth) => void;
}

export const useBoothStore = create<BoothState & BoothAction>((set) => ({
  curBoothMakers: [],
  curBoothPreviews: [],
  boothFilters: new Set([...(Object.keys(photoBooth) as Array<photoBooth>)]),
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
}));
