import { create } from 'zustand';

type FeatureProperties = {
  [key: string]: string | number;
};

interface FeatureData {
  layerName: string;
  properties: FeatureProperties;
}

interface FeatureStore {
  featureData: FeatureData | null;
  setFeatureData: (layerName: string, properties: FeatureProperties) => void;
  getFeatureData: () => FeatureData | null;
  clearFeatureData: () => void;
}

const useFeatureStore = create<FeatureStore>((set, get) => ({
  featureData: null,
  setFeatureData: (layerName, properties) =>
    set({
      featureData: { layerName, properties },
    }),
  getFeatureData: () => get().featureData,
  clearFeatureData: () => set({ featureData: null }),
}));

const useFeatureData = () => {
  const { featureData, setFeatureData, getFeatureData, clearFeatureData } = useFeatureStore();

  return {
    data: featureData,
    setFeatureData,
    getFeatureData,
    clearFeatureData,
  };
};

export default useFeatureData;
