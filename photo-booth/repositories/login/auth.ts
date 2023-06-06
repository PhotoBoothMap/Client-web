import { deleteCookie, getCookie, setCookie } from 'cookies-next';

export const setRefreshTokenCookie = (token: any) => {
  setCookie('refreshToken', token, { httpOnly: true });
};

export const setAccessTokenCookie = (token: any) => {
  setCookie('accessToken', token);
};

export const getTokenCookie = (type: 'refresh' | 'access') => {
  getCookie(`${type}Token`);
};

export const deleteTokenCookie = (type: 'refresh' | 'access') => {
  deleteCookie(`${type}Token`);
};

export const kakaoLoginApi = async (code: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/kakao/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authorizationCode: code,
    }),
  }).then((res) => res.json());

  return response;
};

export const validateApi = async (AT: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/members/validate/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AT}`,
    },
  }).then((res) => res.json());

  return response;
};

export const reIssueApi = async (refreshToken: any, accessToken: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/reissue/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());

  return response;
};
