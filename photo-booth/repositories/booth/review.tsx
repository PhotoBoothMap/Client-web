import { HOST_URL } from '@assets/url';
import { Review } from '@utils/interface/photoBooth';
import axios from 'axios';

export const registerPhotoApi = (boothId: number, file: any) => {
  const data = axios
    .post(`${HOST_URL}/booth/${boothId}/image`, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
  return data;
};

export const deletePhotoApi = (imageUrl: string) => {
  const data = axios
    .delete(`${HOST_URL}/image?imageUrl=${imageUrl}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
  return data;
};

export const registerReviewApi = (boothId: number, requestBody: {}) => {
  const data = axios
    .post(`${HOST_URL}/booth/${boothId}/review`, requestBody)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
  return data;
};

interface Response<T> {
  success: boolean;
  data: { result: T };
}

export const requestReviewApi = async (boothId: number, count: number) => {
  try {
    const response: Response<{
      review: Array<Review>;
    }> = await axios.get(`${HOST_URL}/booth/${boothId}/review?count=${count}`);
    if (!response.success) {
      Error('get review error');
      return { review: [] as Review[] };
    } else {
      return response.data.result;
    }
  } catch (e) {
    console.log(e);
    return { review: [] as Review[] };
  }
};
