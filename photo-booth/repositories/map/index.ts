import { HOST_URL } from '@assets/url';
import { Coordinate } from '@utils/interface/basic';
import { BoothMarker, BoothPreview } from '@utils/interface/photoBooth';

import axios from 'axios';

class MapRepository {
  async getMarkers(curCor: Coordinate, nextCor: Coordinate): Promise<Array<BoothMarker> | null> {
    const { lat: curX, long: curY } = curCor;
    const { lat: nextX, long: nextY } = nextCor;
    try {
      const response: Array<BoothMarker> = await axios.get(
        `${HOST_URL}/map?curx=${curX}&cury=${curY}&nex=${nextX}&ney=${nextY}`,
      );
      return response;
    } catch (e) {
      return null;
    }
  }

  async getBoothList(curCor: Coordinate, count: number): Promise<Array<BoothPreview> | null> {
    const { lat: curX, long: curY } = curCor;
    try {
      const response: Array<BoothPreview> = await axios.get(
        `${HOST_URL}/map?curx=${curX}&cury=${curY}&count=${count}`,
      );
      return response;
    } catch (e) {
      return null;
    }
  }
}

export const mapRepository = new MapRepository();
