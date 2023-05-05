import { clone } from '@utils/tools/BasicUtils';

/** 시청 좌표 */
const DEFAULTCOR = {
  lat: 37.5283,
  long: 126.9294,
};

export function defaultCor() {
  return clone(DEFAULTCOR);
}
