import axios from 'axios';
import { HOST_URL } from '@assets/url';

export const authAPI = axios.create({
  baseURL: `${HOST_URL}`,
});
authAPI.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    // 요청이 전달되기 전에 작업 수행 (성공하면 그냥 지나감)
    return config;
  },
  async (err) => {
    // 요청 오류가 있는 작업 수행
    const {
      config,
      response: { status },
    } = err;

    /** 1 */
    if (config.url === '/auth/reissue/' || status !== 401 || config.sent) {
      window.location.replace('/account/login');
      return Promise.reject(err);
    }

    /** 2 */
    config.sent = true;
    const reIssueResponse = await reIssueApi();
    const accessToken = reIssueResponse.headers.get('Authorization');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return axios(config);
  },
);

export const kakaoLoginApi = async (code: string) => {
  const response = axios
    .post(
      `${HOST_URL}/auth/kakao/`,
      JSON.stringify({
        authorizationCode: code,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });

  return response;
};

export const validateApi = async () => {
  const at = authAPI.defaults.headers.common['Authorization'];

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/members/validate/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${at}`,
    },
  }).then((res) => res.json());

  return response;
};

export const reIssueApi = async () => {
  const at = authAPI.defaults.headers.common['Authorization'];

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/reissue/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${at}`,
    },
  }).then((res) => res.json());

  return response;
};

export const logoutApi = async () => {
  const at = authAPI.defaults.headers.common['Authorization'];

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/logout/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${at}`,
    },
  }).then((res) => {
    return res.json();
  });

  if (response.data.success) {
    authAPI.defaults.headers.common['Authorization'] = '';
  }

  return response;
};
