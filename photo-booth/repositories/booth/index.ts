import axios from 'axios';

import { HOST_URL } from '@assets/url';
import { Coordinate } from '@utils/interface/basic';
import { PhotoBooth } from '@utils/interface/photoBooth';

class BoothRepository {
  async getBooth(id: number, curCor: Coordinate): Promise<PhotoBooth | null> {
    const { lat: curX, long: curY } = curCor;
    try {
      const response: PhotoBooth = await axios.get(
        `${HOST_URL}/booth/:${id}?curx=${curX}&cury=${curY}`,
      );
      return response;
    } catch (e) {
      return null;
    }
  }
}

export const boothRepository = new BoothRepository();
