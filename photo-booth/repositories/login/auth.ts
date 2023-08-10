import axios from 'axios';
import { HOST_URL } from '@assets/url';

export const authAPI = axios.create({
  baseURL: `${HOST_URL}`,
});
authAPI.defaults.withCredentials = true;

authAPI.interceptors.response.use(
  (config) => {
    return config;
  },
  async (err) => {
    const {
      config,
      response: { status },
    } = err;

    if (status === 401) {
      window.location.replace('/account/login');
    }

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
  const response = authAPI
    .post(
      `${HOST_URL}/auth/kakao`,
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
  const response = authAPI
    .put(`${process.env.NEXT_PUBLIC_API_HOST}/members/validate`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });

  return response;
};

export const reIssueApi = async () => {
  const response = authAPI
    .get(`${process.env.NEXT_PUBLIC_API_HOST}/auth/reissue`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });

  return response;
};

export const logoutApi = async () => {
  const response = await authAPI
    .post(`${process.env.NEXT_PUBLIC_API_HOST}/auth/logout`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });

  if (response.success) {
    authAPI.defaults.headers.common['Authorization'] = '';
  }

  return response;
};
