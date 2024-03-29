import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

interface loginUserState {
  id: number | null;
  nickName: string | null;
  profile: string | null;
  token: string | null;
  setId: (id: number) => void;
  setNickName: (nickName: string) => void;
  setProfile: (profile: string) => void;
  setToken: (tocken: string) => void;
  resetLoginUser: () => void;
}

type loginUserPersist = (
  config: StateCreator<loginUserState>,
  options: PersistOptions<loginUserState>,
) => StateCreator<loginUserState>;

const initialLoginUser = { id: null, nickName: null, profile: null, token: null };

export const useLoginUserStore = create<loginUserState>(
  (persist as loginUserPersist)(
    (set) => ({
      ...initialLoginUser,
      setId: (id: number) => set({ id: id }),
      setNickName: (nickName: string) => set({ nickName: nickName }),
      setProfile: (profile: string) => set({ profile: profile }),
      setToken: (token: string) => set({ token: token }),
      resetLoginUser: () => {
        set(initialLoginUser);
      },
    }),
    {
      name: 'loginUser',
    },
  ),
);
