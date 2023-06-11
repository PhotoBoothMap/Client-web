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
    const { lat: curX, lng: curY } = curCor;
    const { lat: nextX, lng: nextY } = nextCor;
    const filterToString = Array.from(filter).join(',');

    try {
      const response: Response<{
        boothList: Array<BoothMarker>;
      }> = await axios.get(
        `${HOST_URL}/map?curx=${curX}&cury=${curY}&nex=${nextX}&ney=${nextY}&filter=${filterToString}`,
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
  ): Promise<Array<BoothPreview> | null> {
    const { lat: curX, lng: curY } = curCor;
    const filterToString = Array.from(filter).join(',');
    try {
      const response: Response<{
        boothList: Array<BoothPreview>;
      }> = await axios.get(
        `${HOST_URL}/map/list?curx=${curX}&cury=${curY}&count=${count}&filter=${filterToString}`,
      );
      const result = response.data['result'];
      return result['boothList'];
    } catch (e) {
      return null;
    }
  }

  async searchBooth(keyword: string, filter: Set<photoBooth>) {
    const filterToString = Array.from(filter).join(',');
    try {
      const response: Response<{
        boothList: Array<BoothMarker>;
      }> = await axios.get(`${HOST_URL}/map/search?keyword=${keyword}&filter=${filter}`);

      const result = response.data['result'];
      return result['boothList'];
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

export const mapRepository = new MapRepository();
