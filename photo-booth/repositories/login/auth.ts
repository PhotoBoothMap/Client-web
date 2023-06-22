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
    credentials: 'same-origin',
    body: JSON.stringify({
      authorizationCode: code,
    }),
  });
  // 성공하면 rt, at 저장
  setRefreshTokenCookie(response.headers.get('refresh-token'));
  setAccessTokenCookie(response.headers.get('Authorization'));

  return response.json();
};

export const validateApi = async () => {
  const at = getTokenCookie('access');

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
  const at = getTokenCookie('access');
  const rt = getTokenCookie('refresh');

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/reissue/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${at}`,
    },
  }).then((res) => res.json());

  return response;
};
