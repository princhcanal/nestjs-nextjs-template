import { UserDTO } from 'generated-api';
import create from 'zustand';

interface GlobalState {
  getUser: () => UserDTO | undefined;
  setUser: (user: UserDTO) => void;
  removeUser: () => void;
}

export const LOCAL_STORAGE_USER_KEY = 'user';
export const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'accessToken';
export const LOCAL_STORAGE_REFRESH_TOKEN_KEY = 'refreshToken';

export const useGlobalStore = create<GlobalState>(() => ({
  getUser: () => {
    const user = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

    if (user) {
      return JSON.parse(user);
    }

    return undefined;
  },
  setUser: (user: UserDTO) => {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },
}));
