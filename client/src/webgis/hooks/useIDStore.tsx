import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IDState {
  ids: number[];
  addID: (id: number) => void;
  removeID: (id: number) => void;
  clearIDs: () => void;
}

const useIDStore = create<IDState>()(
  persist(
    (set) => ({
      ids: [],
      addID: (id) => set((state) => ({ ids: [...state.ids, id] })),
      removeID: (id) => set((state) => ({ ids: state.ids.filter((existingId) => existingId !== id) })),
      clearIDs: () => set({ ids: [] }),
    }),
    {
      name: 'id-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useIDStore;
