import create, { StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

interface loginUserState {
  nickName: string | null;
  profile: string | null;
  setNickName: (nickName: string) => void;
  setProfile: (profile: string) => void;
  resetLoginUser: () => void;
}

type loginUserPersist = (
  config: StateCreator<loginUserState>,
  options: PersistOptions<loginUserState>,
) => StateCreator<loginUserState>;

const initialLoginUser = {
  nickName: null,
  profile: null,
};

export const useLoginUserStore = create<loginUserState>(
  (persist as loginUserPersist)(
    (set) => ({
      ...initialLoginUser,
      setNickName: (nickName: string) => set({ nickName: nickName }),
      setProfile: (profile: string) => set({ profile: profile }),
      resetLoginUser: () => {
        set(initialLoginUser);
      },
    }),
    {
      name: 'loginUser',
    },
  ),
);
