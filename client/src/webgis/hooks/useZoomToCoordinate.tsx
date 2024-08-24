import { create } from 'zustand';

type CoordinateState = {
  coordinate: number[];
  setCoordinateValue: (lat: number, lng: number) => void;
};

const useZoomToCoordinate = create<CoordinateState>((set) => ({
  coordinate: [],
  setCoordinateValue: (lat: number, lng: number) => set({ coordinate: [lat, lng] }),
}));

export default useZoomToCoordinate;
