import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TUser = {
  user_id: number;
  username: string;
  exp: number;
};

interface AuthState {
  user: TUser | null;
  token: string | null;
  setAuth: (user: TUser | null, token: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
