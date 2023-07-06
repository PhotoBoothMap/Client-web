import { clone } from '@utils/tools/BasicUtils';
/** 시청 좌표 */
const DEFAULTCOR = {
  lat: 37.5283,
  lng: 126.9294,
};

export function defaultCor()  {
  return clone(DEFAULTCOR);
}

export const BoothColor = {
  인생네컷: '#FF93D4',
  포토이즘: '#FFC635',
  하루필름: '#0073EB',
  포토매틱: '#E55519',
  셀픽스: '#00B86F',
  포토그레이: '#C4C4C4',
  기타: '#404040',
};
