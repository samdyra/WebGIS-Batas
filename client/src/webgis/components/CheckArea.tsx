// components/CheckAreaBoundary.tsx
import React, { useState } from 'react';
import useGeospatialUpload from '../hooks/useGeospatialUpload';
import { usePropData } from '../../shared/hooks/usePropData';
import * as turf from '@turf/turf';

// types/GeoJSON.ts
export interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type: string;
  properties: {
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

const spatialDataTypes = [
  { value: 'LINESTRING', label: 'LINESTRING' },
  { value: 'POLYGON', label: 'POLYGON' },
  { value: 'POINT', label: 'POINT' },
];

interface UploadedFile {
  name: string;
  content: GeoJSON | GeoJSONFeature[] | GeoJSONFeature;
  type: string;
  bbox: number[]; // [minX, minY, maxX, maxY]
}

const CheckAreaBoundary: React.FC = () => {
  const { files, isUploading, handleFileUpload, deleteFile } = useGeospatialUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  // Fetch existing LineString layer data
  const { data: existingData, error, isLoading } = usePropData('Batas_kabupaten_jawa_barat');

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFile && selectedType) {
      try {
        await handleFileUpload(selectedFile, selectedType);
        setSelectedFile(null);
        setSelectedType('');
      } catch (error) {
        alert(error instanceof Error ? error.message : 'An error occurred while uploading the file.');
      }
    } else {
      alert('Please select both a file and a spatial data type.');
    }
  };

  // Function to check overlay
  const handleCheckOverlay = (file: UploadedFile) => {
    if (isLoading) {
      console.log('Existing data is still loading...');
      alert('Existing data is still loading. Please try again later.');
      return;
    }

    if (error) {
      console.log('Error fetching existing data:', error);
      alert('Error fetching existing data. Please try again later.');
      return;
    }

    if (!existingData) {
      console.log('No existing data available.');
      alert('No existing data available.');
      return;
    }

    let uploadedFeatures: GeoJSONFeature[] = [];

    // Extract features from the uploaded file
    if (file.content.type === 'FeatureCollection' && Array.isArray(file.content.features)) {
      uploadedFeatures = file.content.features;
    } else if (file.content.type === 'Feature') {
      uploadedFeatures = [file.content];
    } else {
      console.log('Unsupported GeoJSON type:', file.content.type);
      alert('Unsupported GeoJSON type. Please upload a valid Feature or FeatureCollection.');
      return;
    }

    const existingFeatures = existingData.features;

    const overlappingProperties: any[] = [];

    uploadedFeatures.forEach((uploadedFeature) => {
      if (!uploadedFeature.geometry) {
        console.warn('Uploaded feature has no geometry:', uploadedFeature);
        return;
      }

      const uploadedGeometryType = uploadedFeature.geometry.type;

      existingFeatures.forEach((existingFeature) => {
        if (!existingFeature.geometry) {
          console.warn('Existing feature has no geometry:', existingFeature);
          return;
        }

        const existingGeometryType = existingFeature.geometry.type;

        let isOverlapping = false;

        // Determine the spatial relationship based on geometry types
        if (
          (uploadedGeometryType === 'Polygon' || uploadedGeometryType === 'MultiPolygon') &&
          (existingGeometryType === 'LineString' || existingGeometryType === 'MultiLineString')
        ) {
          // Check if LineString intersects with Polygon
          isOverlapping = turf.booleanIntersects(uploadedFeature, existingFeature);
        } else if (
          (uploadedGeometryType === 'LineString' || uploadedGeometryType === 'MultiLineString') &&
          (existingGeometryType === 'LineString' || existingGeometryType === 'MultiLineString')
        ) {
          // Check if LineStrings intersect
          isOverlapping = turf.booleanIntersects(uploadedFeature, existingFeature);
        } else if (
          (uploadedGeometryType === 'Point' || uploadedGeometryType === 'MultiPoint') &&
          (existingGeometryType === 'LineString' || existingGeometryType === 'MultiLineString')
        ) {
          // Check if Point lies on the LineString
          const pointOnLine = turf.booleanPointOnLine(uploadedFeature, existingFeature);
          isOverlapping = pointOnLine;
        }

        if (isOverlapping) {
          overlappingProperties.push(existingFeature.properties);
        }
      });
    });

    if (overlappingProperties.length > 0) {
      console.log('Overlapping LineString Properties:', overlappingProperties);
      alert('Overlapping features found! Check the console for properties.');
    } else {
      console.log('No overlayed');
      alert('No overlayed');
    }
  };

  return (
    <div className="border-2 mx-sm pt-sm rounded-md h-full mb-2 p-4">
      <h2 className="text-lg font-bold mb-4">Cek Batas Area</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="spatialDataType">
            Select Spatial Data Type
          </label>
          <select
            id="spatialDataType"
            value={selectedType}
            onChange={onTypeChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a type</option>
            {spatialDataTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="geospatialFile">
            Upload GeoJSON or Shapefile (ZIP)
          </label>
          <input
            id="geospatialFile"
            type="file"
            accept=".geojson,application/geo+json,.zip"
            onChange={onFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isUploading}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-main-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isUploading || !selectedFile || !selectedType}
        >
          Submit
        </button>
      </form>
      {isUploading && <p className="mt-4">Uploading...</p>}
      {files && files.length > 0 && (
        <div className="mt-4">
          <p className="text-md font-semibold mb-2">Uploaded Files:</p>
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded pr-4">
                <span className="pl-2 text-sm">{file.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCheckOverlay(file)}
                    className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Check Overlay
                  </button>
                  <button
                    onClick={() => deleteFile(file.name)}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckAreaBoundary;
