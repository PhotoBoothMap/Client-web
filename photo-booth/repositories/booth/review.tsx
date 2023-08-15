import { HOST_URL } from '@assets/url';
import { authAPI } from '@repositories/login/auth';
import { Review } from '@utils/interface/photoBooth';

export const registerPhotoApi = (boothId: number, file: any) => {
  const data = authAPI
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
  const data = authAPI
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
  const data = authAPI
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
  data: { result: T; success: boolean };
}

export const requestReviewApi = async (boothId: number, count: number) => {
  try {
    const response: Response<{
      review: Array<Review>;
    }> = await authAPI.get(`${HOST_URL}/booth/${boothId}/review?count=${count}`);
    if (!response.data.success) {
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
