declare global {
  interface Window {
    kakao: any;
  }
}

export const kakao = Window.kakao;
