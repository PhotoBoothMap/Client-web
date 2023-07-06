import { HOST_URL } from '@assets/url';
import { authAPI } from '@repositories/login/auth';

export const getMyReviewsApi = () => {
  const data = authAPI
    .get(`${HOST_URL}/mypage`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
  return data;
};
