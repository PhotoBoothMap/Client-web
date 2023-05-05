import axios from 'axios';

import { HOST_URL } from '@assets/url';
import { Coordinate } from '@utils/interface/basic';
import { PhotoBooth } from '@utils/interface/photoBooth';

interface Response<T> {
  result: T;
}

class BoothRepository {
  async getBooth(id: number, curCor: Coordinate): Promise<PhotoBooth | null> {
    const { lat: curX, long: curY } = curCor;
    try {
      const response: Response<{ photobooth: PhotoBooth }> = await axios.get(
        `${HOST_URL}/booth/:${id}?curx=${curX}&cury=${curY}`,
      );
      const result = response['result'];
      return result['photobooth'];
    } catch (e) {
      return null;
    }
  }
}

export const boothRepository = new BoothRepository();
