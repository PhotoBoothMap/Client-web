import { HOST_URL } from '@assets/url';
import { Coordinate } from '@utils/interface/basic';
import { BoothMarker, BoothPreview, photoBooth } from '@utils/interface/photoBooth';

import axios from 'axios';

interface Response<T> {
  data: { result: T };
}

class MapRepository {
  async getMarkers(
    curCor: Coordinate,
    nextCor: Coordinate,
    filter: Set<photoBooth>,
  ): Promise<Array<BoothMarker> | null> {
    const { lat: curLat, lng: curLng } = curCor;
    const { lat: nextLat, lng: nextLng } = nextCor;
    const filterToString = Array.from(filter).join(',');

    try {
      const response: Response<{
        boothList: Array<BoothMarker>;
      }> = await axios.get(
        `${HOST_URL}/map?clat=${curLat}&clng=${curLng}&nlat=${nextLat}&nlng=${nextLng}&filter=${filterToString}`,
      );
      const result = response.data['result'];
      return result['boothList'];
    } catch (e) {
      return [];
    }
  }

  async getBoothList(
    curCor: Coordinate,
    count: number,
    filter: Set<photoBooth>,
  ): Promise<Array<BoothPreview> | []> {
    const { lat: curLat, lng: curLng } = curCor;
    const filterToString = Array.from(filter).join(',');
    try {
      const response: Response<{
        boothList: Array<BoothPreview>;
      }> = await axios.get(
        `${HOST_URL}/map/list?clat=${curLat}&clng=${curLng}&count=${count}&filter=${filterToString}`,
      );
      const result = response.data['result'];
      return result['boothList'];
    } catch (e) {
      return [];
    }
  }

  async searchBooth(curCor: Coordinate, neCor: Coordinate, keyword: string) {
    try {
      const response: Response<{
        boothList: Array<BoothMarker>;
      }> = await axios.get(
        `${HOST_URL}/map/search?clat=${curCor.lat}&clng=${curCor.lng}&nlat=${neCor.lat}&nlng=${neCor.lng}&keyword=${keyword}`,
      );
      const result = response.data['result'];
      return result['boothList'];
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

export const mapRepository = new MapRepository();
