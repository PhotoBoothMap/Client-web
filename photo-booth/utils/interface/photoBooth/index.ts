export enum photoBooth {
  lifeFourCuts = '인생네컷',
  photoism = '포토이즘',
  dailyFilm = '하루필름',
  photomatic = '포토매틱',
  selfics = '셀픽스',
  photogrey = '포토그레이',
  etc = '기타',
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

export interface PhotoBooth {
  id: number;
  brand: photoBooth;
  name: string;
  call: string;
  address: string;
  distance: number;
  score: number;
  review: Array<Review>;
  reviewNum: number;
  homepage: string;
  status: string;
  userTags: {
    userTag: number;
  };
  coordinate: {
    lat: number;
    long: number;
  };
}

export interface BoothMarker extends Partial<Pick<PhotoBooth, 'id' | 'brand' | 'coordinate'>> {}

export interface BoothPreview
  extends Partial<
    Pick<PhotoBooth, 'id' | 'brand' | 'name' | 'distance' | 'address' | 'score' | 'reviewNum'>
  > {}

export interface Review {
  user: string;
  date: Date;
  content: string;
  userTags: Array<userTag>;
}
