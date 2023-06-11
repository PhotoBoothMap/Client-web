import axios from 'axios';

import { HOST_URL } from '@assets/url';
import { PhotoBooth, photoBooth } from '@utils/interface/photoBooth';

interface Response<T> {
  data: { result: T };
}

class BoothRepository {
  async getBooth(id: number): Promise<PhotoBooth | null> {
    try {
      const response: Response<{ photobooth: PhotoBooth }> = await axios.get(
        `${HOST_URL}/booth/:${id}`,
      );
      const result = response.data['result'];
      return result['photobooth'];
    } catch (e) {
      return null;
    }
  }

  async searchBooth(id: string, keyword: string, filter: photoBooth[]) {}
}

export const boothRepository = new BoothRepository();
