// src/store/useDetailBarStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DetailBarState {
  isDetailBarOpen: boolean;
  toggleDetailBar: () => void;
  openDetailBar: () => void;
  closeDetailBar: () => void;
}

const useDetailBarStore = create<DetailBarState>()(
  persist(
    (set) => ({
      isDetailBarOpen: false, // Initial state
      toggleDetailBar: () => set((state) => ({ isDetailBarOpen: !state.isDetailBarOpen })),
      openDetailBar: () => set({ isDetailBarOpen: true }),
      closeDetailBar: () => set({ isDetailBarOpen: false }),
    }),
    {
      name: 'detailbar-storage', // Unique name for storage
      getStorage: () => localStorage, // Use localStorage (default)
    }
  )
);

export default useDetailBarStore;
