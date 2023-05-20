import { HOST_URL } from '@assets/url';
import axios from 'axios';

import { createSession } from '../../../lib/secret/createSession';
import client from '../../../lib/server/client';

interface Response<T> {
  result: T;
}

import { NextApiRequest, NextApiResponse } from 'next';

interface TokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  refresh_token_expires_in: string;
  scope: string;
}

interface UserInfo {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string; // 640x640
    thumbnail_image?: string; // 110x110
  };
}

async function getTokenFromKakao(authCode: string) {
  const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_RESTAPI_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&code=${authCode}`;
  const response: TokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());
  return response;
}

async function getUserFromKakao({ access_token }: TokenResponse) {
  const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
  const response: UserInfo = await fetch(userInfoUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  }).then((res) => res.json());
  return response;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { authCode } = req.body; // 인가 코드

  // 토큰 받아오기
  const tokenResponse = await getTokenFromKakao(authCode);

  // 유저 정보 받아오기
  const userInfo = await getUserFromKakao(tokenResponse);
  const {
    id: kakaoId,
    properties: { nickname, profile_image, thumbnail_image },
  } = userInfo;
};

// 1. 세션만 업데이트하는 함수
async function updateSession(kakaoId: number, newSessionId: string) {
  const session = await client.session.update({
    where: {
      kakaoId,
    },
    data: {
      sessionId: newSessionId,
    },
  });
  return session;
}

// 2. 세션을 생성하고 유저와 연결하는 함수
async function createSessionAndConnectToUser(kakaoId: number, newSessionId: string) {
  const user = await client.user.update({
    where: {
      kakaoId,
    },
    data: {
      session: {
        create: { kakaoId, sessionId: newSessionId },
      },
    },
  });
  return user;
}

// 3. 새로운 유저를 생성하는 함수 (회원가입)
const signUp = async (
  { id: kakaoId, properties: { nickname, profile_image, thumbnail_image } }: UserInfo,
  newSessionId: string,
) => {
  const user = await client.user.create({
    data: {
      name: nickname,
      kakaoId,
      loggedFrom: 'Kakao',
      profileImage: profile_image || null,
      session: {
        create: { kakaoId, sessionId: newSessionId },
      },
    },
  });
  return user;
};

let user;
const newSessionId = createSession(kakaoId); // 새로운 세션 생성

// 데이터베이스 조회를 최소화하기 위해 이중 try문으로 구현했다.
try {
  // 1. 세션이 존재하면 업데이트만 해주면 됨
  await updateSession(kakaoId, newSessionId);
} catch {
  try {
    // 2. 유저는 존재하는데 세션이 없는 경우 유저의 세션 값만 업데이트 해준다.
    user = await createSessionAndConnectToUser(kakaoId, newSessionId);
  } catch {
    // 유저가 존재하지 않으면 새로운 계정을 생성한다.
    user = await createUser(userInfo, newSessionId);
  }
}

// 유저에게 세션 부여
req.session.user = { id: newSessionId };
await req.session.save();
return res.json({ ok: true });
