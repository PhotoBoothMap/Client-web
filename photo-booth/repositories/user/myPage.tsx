import axios from 'axios';
import { HOST_URL } from '@assets/url';

export const getMyReviewsApi = () => {
  const data = axios
    .get(`${HOST_URL}/mypage`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data;
    });
  return data;
};
