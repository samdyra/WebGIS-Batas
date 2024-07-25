import { useQuery, useQueryClient } from 'react-query';

type FeatureProperties = {
  [key: string]: string | number;
};

const FEATURE_QUERY_KEY = 'featureData';

const useFeatureData = () => {
  const queryClient = useQueryClient();

  const setFeatureData = (data: FeatureProperties) => {
    queryClient.setQueryData<FeatureProperties>(FEATURE_QUERY_KEY, data);
  };

  const getFeatureData = () => {
    return queryClient.getQueryData<FeatureProperties>(FEATURE_QUERY_KEY);
  };

  const query = useQuery<FeatureProperties>(FEATURE_QUERY_KEY, {
    // initialData: {},
  });

  return {
    ...query,
    setFeatureData,
    getFeatureData,
  };
};

export default useFeatureData;
