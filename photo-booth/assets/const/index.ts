import { clone } from '@utils/tools/BasicUtils';
/** 시청 좌표 */
const DEFAULTCOR = {
  lat: 37.5283,
  lng: 126.9294,
};

export function defaultCor() {
  return clone(DEFAULTCOR);
}

export const BoothColor = {
  인생네컷: '#FF93D4',
  포토이즘: '#FF4F06',
  하루필름: '#0981FF',
  모노맨션: '#FFA800',
  포토시그니처: '#7483D8',
  셀픽스: '#00C543',
  포토그레이: '#888888',
  기타: '#F2F2F2',
};
