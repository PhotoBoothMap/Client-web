import { setCookie } from 'cookies-next';

export const setRTCookie = (token: any) => {
  setCookie('RT', token, { httpOnly: true });
};
