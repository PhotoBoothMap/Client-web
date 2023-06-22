import create from 'zustand';

interface loginUserState {
  nickName: string | null;
  profile: string | null;
  setnickName: (nickName: string) => void;
  setProfile: (profile: string) => void;
}

export const useLoginUserStore = create<loginUserState>((set) => ({
  isLogin: false,
  nickName: null,
  profile: null,
  setnickName: (nickName: string) => set({ nickName: nickName }),
  setProfile: (profile: string) => set({ profile: profile }),
}));
