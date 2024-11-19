import create from 'zustand';

interface LayerToggleState {
  selectedLayer: 'none' | 'desa' | 'kecamatan';
  setSelectedLayer: (layer: 'none' | 'desa' | 'kecamatan') => void;
}

export const useLayerToggleStore = create<LayerToggleState>((set) => ({
  selectedLayer: 'none',
  setSelectedLayer: (layer) => set({ selectedLayer: layer }),
}));
