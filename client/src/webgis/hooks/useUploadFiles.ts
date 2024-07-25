import { useMutation, useQuery, useQueryClient } from 'react-query';

type GeoJsonFeature = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][];
  };
  properties: {
    [key: string]: any;
  };
};

type UploadedFile = {
  name: string;
  content: GeoJsonFeature;
};

const GEOJSON_FILES_QUERY_KEY = 'geojsonFiles';

const useUploadFiles = () => {
  const queryClient = useQueryClient();

  // Query to retrieve the list of uploaded files
  const {
    data: files,
    isLoading,
    isError,
  } = useQuery<UploadedFile[]>(GEOJSON_FILES_QUERY_KEY, {
    initialData: [],
  });

  // Mutation to add a new file
  const { mutate: addFile } = useMutation(
    async (newFile: UploadedFile) => {
      return [...(files || []), newFile];
    },
    {
      onSuccess: (newData) => {
        queryClient.setQueryData(GEOJSON_FILES_QUERY_KEY, newData);
      },
    }
  );

  // Function to delete a file
  const deleteFile = (fileName: string) => {
    const updatedFiles = (files || []).filter((file) => file.name !== fileName);
    queryClient.setQueryData(GEOJSON_FILES_QUERY_KEY, updatedFiles);
  };

  return {
    files,
    isLoading,
    isError,
    addFile,
    deleteFile,
  };
};

export default useUploadFiles;
