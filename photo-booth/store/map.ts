import { defaultCor } from '@assets/const';
import { Coordinate } from '@utils/interface/basic';

import { create } from 'zustand';

interface MapState {
  initialPosition: Coordinate; // 위치 정보 기반 유저 좌표 정보
  curPosition: Coordinate; // 이동, 검색에 다른 좌표 정보
}

interface MapAction {
  setInitialPostion: (position: Coordinate) => void;
  setCurPosition: (position: Coordinate) => void;
}

export const useMapStore = create<MapState & MapAction>((set) => ({
  initialPosition: defaultCor(),
  curPosition: defaultCor(),
  setInitialPostion: (position: Coordinate) => {
    set(() => ({ curPosition: position }));
  },
  setCurPosition: (position: Coordinate) => {
    set(() => ({ curPosition: position }));
  },
}));
