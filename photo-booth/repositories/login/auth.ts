import axios from 'axios';
import { HOST_URL } from '@assets/url';
import { useLoginUserStore } from '@store/login';

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

    const originAccessTocken = config.headers.Authorization;
    config.sent = true;

    if (originAccessTocken && status === 401) {
      if (config.url !== `${process.env.NEXT_PUBLIC_API_HOST}/members/validate`) {
        const validateResponse = await validateApi();
        // const accessToken = reIssueResponse.headers.get('Authorization');
        const accessToken = validateResponse.data.result.accessToken;
        config.headers.Authorization = accessToken;
        return axios(config);
      } else if (config.url === `${process.env.NEXT_PUBLIC_API_HOST}/members/validate`) {
        const reIssueResponse = await reIssueApi();
        const accessToken = reIssueResponse.data.result.accessToken;
        config.headers.Authorization = accessToken;
        return axios(config);
      } else if (config.url === `${process.env.NEXT_PUBLIC_API_HOST}/auth/reissue`) {
        window.location.replace('/account/login');
        localStorage.removeItem('loginUser');
        return Promise.reject(err);
      }
    }

    const loginUserState = localStorage.getItem('loginUser');
    if (loginUserState) {
      // 토큰 저장되어 있는 경우
      const token = JSON.parse(loginUserState).state.token;

      // 새로고침한 경우
      if (status === 401) {
        config.headers.Authorization = token;
        return axios(config);
      }
    } else {
      // 토큰 저장 안 되어 있는 경우
      localStorage.removeItem('loginUser');
      window.location.replace('/account/login');
    }
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
