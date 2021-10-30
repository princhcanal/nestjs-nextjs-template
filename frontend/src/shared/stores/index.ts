import { UserDTO } from 'generated-api';
import create from 'zustand';
import { LocalStorageKeys } from '../enums/localStorageKeys';

interface GlobalState {
  getUser: () => UserDTO | undefined;
  setUser: (user: UserDTO) => void;
  removeUser: () => void;
}

export const useGlobalStore = create<GlobalState>(() => ({
  getUser: () => {
    const user = localStorage.getItem(LocalStorageKeys.USER);

    if (user) {
      return JSON.parse(user);
    }

    return undefined;
  },
  setUser: (user: UserDTO) => {
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem(LocalStorageKeys.USER);
  },
}));
