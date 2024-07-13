import { useQuery, useQueryClient } from 'react-query';

const basemaps = {
  osm: 'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json',
  satellite: 'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json',
};

const useQueryBaseMap = () => {
  const queryClient = useQueryClient();

  // Initialize the baseMap state with useQuery
  const { data: baseMap = 'osm' } = useQuery('baseMap', () => 'osm', {
    initialData: 'osm',
  });

  const switchBaseMap = () => {
    const newBaseMap = baseMap === 'osm' ? 'satellite' : 'osm';
    queryClient.setQueryData('baseMap', newBaseMap);
  };

  const style = baseMap === 'osm' ? basemaps.osm : basemaps.satellite;

  return { baseMap: style, switchBaseMap };
};

export default useQueryBaseMap;
