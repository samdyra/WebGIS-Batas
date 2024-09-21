import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import shp from 'shpjs';

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
  content: GeoJsonFeature | GeoJsonFeature[];
  type: string;
};

const GEOSPATIAL_FILES_QUERY_KEY = 'geospatialFiles';

const useGeospatialUpload = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: files,
    isLoading,
    isError,
  } = useQuery<UploadedFile[]>(GEOSPATIAL_FILES_QUERY_KEY, {
    initialData: [],
  });

  const { mutate: addFile } = useMutation(
    async (newFile: UploadedFile) => {
      return [...(files || []), newFile];
    },
    {
      onSuccess: (newData) => {
        queryClient.setQueryData(GEOSPATIAL_FILES_QUERY_KEY, newData);
      },
    }
  );

  const deleteFile = (fileName: string) => {
    const updatedFiles = (files || []).filter((file) => file.name !== fileName);
    queryClient.setQueryData(GEOSPATIAL_FILES_QUERY_KEY, updatedFiles);
  };

  const handleFileUpload = async (file: File, type: string): Promise<void> => {
    setIsUploading(true);
    try {
      if (file.name.endsWith('.geojson')) {
        const text = await file.text();
        const geoJsonData = JSON.parse(text);
        addFile({ name: file.name, content: geoJsonData, type });
      } else if (file.name.endsWith('.zip')) {
        const arrayBuffer = await file.arrayBuffer();
        const geojson = await shp(arrayBuffer);
        addFile({ name: file.name.replace('.zip', '.geojson'), content: geojson, type });
      } else {
        throw new Error('Unsupported file type. Please upload a GeoJSON or zipped Shapefile.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    files,
    isLoading,
    isError,
    isUploading,
    addFile,
    deleteFile,
    handleFileUpload,
  };
};

export default useGeospatialUpload;
