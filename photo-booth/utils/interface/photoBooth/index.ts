export enum photoBooth {
  인생네컷 = '인생네컷',
  포토이즘 = '포토이즘',
  하루필름 = '하루필름',
  포토매틱 = '포토매틱',
  셀픽스 = '셀픽스',
  포토그레이 = '포토그레이',
  기타 = '기타',
}

/**
 * 수정 예정
 */
export enum userTag {
  clear = '시설이 깔끔해요',
  dark = '어둡게 나와요',
  variety = '소품이 다양해요',
  parkingless = '주차공간이 없어요',
}

export interface BoothDetail {
  id: number;
  brand: photoBooth;
  name: string;
  call: string;
  address: string;
  distance: number;
  score: number;
  reviewNum: number;
  homepage: string;
  status: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  frame: {
    shape: string | null;
    price: number;
  };
}

export interface Review {
  user: string;
  date: Date;
  content: string;
  imgUrl: string;
  userTags: Array<userTag>;
}

export interface PhotoBooth {
  boothDetail: BoothDetail;
  review: Review[];
}

export interface BoothMarker extends Partial<Pick<BoothDetail, 'id' | 'brand' | 'coordinate'>> {}

export interface BoothPreview
  extends Partial<
    Pick<BoothDetail, 'id' | 'brand' | 'name' | 'distance' | 'address' | 'score' | 'reviewNum'>
  > {}
