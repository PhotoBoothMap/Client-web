import axios from 'axios';
import { HOST_URL } from '@assets/url';

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
