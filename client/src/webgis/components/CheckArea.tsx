// components/CheckAreaBoundary.tsx
import React, { useState } from 'react';
import useGeospatialUpload from '../hooks/useGeospatialUpload';
import { usePropData } from '../../shared/hooks/usePropData';
import * as turf from '@turf/turf';
import { FaTrash, FaCalculator } from 'react-icons/fa'; // Importing necessary icons
import { Modal } from '../../admin/shared/components/Modal'; // Import the Modal component

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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string[]>([]); // Changed to string array

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

  // Helper function to generate individual analysis sentences
  const generateAnalysis = (overlappingProperties: any[]): string[] => {
    const analysisList: string[] = [];

    overlappingProperties.forEach((prop) => {
      if (prop.namobj) {
        const parts = prop.namobj.split(' - ').map((part: string) => part.trim());
        if (parts.length === 2) {
          const [kabupaten, secondPart] = parts;
          // Determine if the second part is a Kota or Kabupaten
          const isKota = secondPart.startsWith('Kota');
          const secondLayer = isKota ? secondPart : `Kabupaten ${secondPart}`;
          const sentence = `Batas antara Kabupaten ${kabupaten} dan ${secondLayer}`;
          analysisList.push(sentence);
        } else if (parts.length === 1) {
          // If only one part, assume it's Kabupaten
          const [kabupaten] = parts;
          const sentence = `Batas Kabupaten ${kabupaten}`;
          analysisList.push(sentence);
        }
        // Handle cases where parts.length > 2 if necessary
      }
    });

    return analysisList;
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

    const overlappingPropertiesSet = new Set<string>();

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
          // Serialize properties to JSON string to store in Set (prevents duplicates)
          overlappingPropertiesSet.add(JSON.stringify(existingFeature.properties));
        }
      });
    });

    // Convert Set back to array of objects
    const overlappingProperties = Array.from(overlappingPropertiesSet).map((prop) => JSON.parse(prop));

    if (overlappingProperties.length > 0) {
      console.log('Overlapping LineString Properties:', overlappingProperties);
      const analysisList = generateAnalysis(overlappingProperties);
      setModalContent(analysisList); // Set the array
      setIsModalOpen(true);
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
          <p className="text-md font-semibold mb-2">Data Spasial yang terunggahs:</p>
          <ul className="pb-2">
            {files.map((file, index) => (
              <li key={index} className="mb-2 last:mb-0">
                <div className="flex items-center justify-between border rounded p-2 text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{file.name}</span>
                    <div className="flex mt-1 space-x-1">
                      {/* Check Overlay Button */}
                      <button
                        onClick={() => handleCheckOverlay(file)}
                        className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                        title="Check Overlay"
                      >
                        <FaCalculator className="h-3 w-3 " />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteFile(file.name)}
                        className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                        title="Delete File"
                      >
                        <FaTrash className="h-3 w-3 " />
                      </button>
                    </div>
                  </div>
                  {/* Optional: Color Indicator or Any Other Info */}
                  <div className="w-1 h-10 rounded" style={{ backgroundColor: 'rgba(255, 0, 0, 1)' }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for Displaying Analysis */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Analisis Overlapping">
        <h4>Data spasial ini overlap dengan: </h4>
        <ul className="list-disc list-inside">
          {modalContent.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default CheckAreaBoundary;
