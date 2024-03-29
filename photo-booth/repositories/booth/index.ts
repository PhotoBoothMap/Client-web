import { HOST_URL } from '@assets/url';
import { PhotoBooth, Review, photoBooth } from '@utils/interface/photoBooth';
import { authAPI } from '@repositories/login/auth';

interface Response<T> {
  data: { result: T };
}

class BoothRepository {
  async getBooth(id: number): Promise<PhotoBooth | null> {
    try {
      const response: Response<PhotoBooth> = await authAPI.get(`${HOST_URL}/booth/${id}`);

      const result = response.data['result'];
      return result;
    } catch (e) {
      return null;
    }
  }

  async getReview(id: number, count: number): Promise<{ review: Array<Review> } | null> {
    try {
      const response: Response<{ review: Array<Review> }> = await authAPI.get(
        `${HOST_URL}/booth/${id}/review?count=${count}`,
      );
      const result = response.data['result'];
      return result;
    } catch (e) {
      return null;
    }
  }

  async searchBooth(id: string, keyword: string, filter: photoBooth[]) {}
}

export const boothRepository = new BoothRepository();
