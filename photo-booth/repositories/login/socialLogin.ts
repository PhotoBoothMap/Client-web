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
      // 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjg1MTYxNjE1LCJlbWFpbCI6ImRpcmxhZGJxbHNAbmF2ZXIuY29tIn0.ppJ9XjmpGfQGhwukm3088GvxV4Pyab1QpmN2y6XRDHpgPh3vI4sVObBBpWyq_SwyZoK9lgR63X6H2g7kcTXR9A',
    },
  }).then((res) => res.json());

  return response;
};
