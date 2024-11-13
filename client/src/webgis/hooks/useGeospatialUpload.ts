import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import shp from 'shpjs';
import { bbox } from '@turf/turf'; // Import bbox function

type UploadedFile = {
  name: string;
  content: GeoJsonFeature | GeoJsonFeature[];
  type: string;
  bbox: number[]; // [minX, minY, maxX, maxY]
};

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

const GEOSPATIAL_FILES_QUERY_KEY = 'geospatialFiles';

const useGeospatialUpload = () => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [fileToZoom, setFileToZoom] = useState<UploadedFile | null>(null);

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
      let geoJsonData;
      if (file.name.endsWith('.geojson')) {
        const text = await file.text();
        geoJsonData = JSON.parse(text);
      } else if (file.name.endsWith('.zip')) {
        const arrayBuffer = await file.arrayBuffer();
        geoJsonData = await shp(arrayBuffer);
      } else {
        throw new Error('Unsupported file type. Please upload a GeoJSON or zipped Shapefile.');
      }

      const boundingBox = bbox(geoJsonData); // Compute bounding box

      addFile({
        name: file.name.endsWith('.zip') ? file.name.replace('.zip', '.geojson') : file.name,
        content: geoJsonData,
        type,
        bbox: boundingBox,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const zoomToFile = (fileName: string) => {
    const file = files?.find((f) => f.name === fileName);
    if (file) {
      setFileToZoom(file);
    }
  };

  const clearFileToZoom = () => {
    setFileToZoom(null);
  };

  return {
    files,
    isLoading,
    isError,
    isUploading,
    addFile,
    deleteFile,
    handleFileUpload,
    fileToZoom,
    zoomToFile,
    clearFileToZoom,
  };
};

export default useGeospatialUpload;
