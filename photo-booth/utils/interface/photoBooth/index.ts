export enum photoBooth {
  인생네컷 = '인생네컷',
  포토이즘 = '포토이즘',
  하루필름 = '하루필름',
  포토매틱 = '포토매틱',
  셀픽스 = '셀픽스',
  포토그레이 = '포토그레이',
  기타 = '기타',
}

export const tags = {
  PICTURE: '사진이 잘 나와요',
  LIGHT: '조명이 좋아요',
  RETOUCH: '보정이 자연스러워요',
  VARIOUS: '소품이 다양해요',
  CLEAN: '소품이 깨끗해요',
  BOOTH: '부스 구성이 다양해요',
  FACILITY: '시설이 깔끔해요',
  POWDER_ROOM: '파우더룸이 잘 되어있어요',
  PARKING: '주차가 편해요',
};

export type tagKey =
  | 'PICTURE'
  | 'LIGHT'
  | 'RETOUCH'
  | 'VARIOUS'
  | 'CLEAN'
  | 'BOOTH'
  | 'FACILITY'
  | 'POWDER_ROOM'
  | 'PARKING';

/**
 * 수정 예정
 */
// export enum userTag {
//   clear = '시설이 깔끔해요',
//   dark = '어둡게 나와요',
//   variety = '소품이 다양해요',
//   parkingless = '주차공간이 없어요',
// }

export interface BoothDetail {
  id: number;
  brand: photoBooth;
  name: string;
  address: string;
  score: number;
  distance: number;
  reviewNum: number;
  status: string;
  coordinate: {
    lat: number;
    lng: number;
  };
}

export interface Review {
  user: string;
  date: Date;
  content: string;
  imgUrl: string;
  userTags: Array<tagKey>;
}

export interface PhotoBooth {
  boothDetail: Pick<BoothDetail, 'id' | 'brand' | 'name' | 'address' | 'score' | 'reviewNum'>;
  review: Review[];
}

export interface BoothMarker extends Pick<BoothDetail, 'id' | 'brand' | 'coordinate'> {}

export interface BoothPreview
  extends Partial<
    Pick<BoothDetail, 'id' | 'brand' | 'name' | 'address' | 'distance' | 'score' | 'reviewNum'>
  > {}
