import React, { useState } from 'react';
import useGeospatialUpload from '../hooks/useGeospatialUpload';
import { usePropData } from '../../shared/hooks/usePropData';
import * as turf from '@turf/turf';
import { FaTrash, FaCalculator, FaDownload } from 'react-icons/fa';
import { Modal } from '../../admin/shared/components/Modal';
import shpwrite from '@mapbox/shp-write';
import { saveAs } from 'file-saver';

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

interface GeoJSONFeature {
  type: string;
  properties: {
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

interface EnhancedAnalysis {
  overlappingBoundaries: string[];
  metrics: {
    uploadedArea?: number;
    uploadedLength?: number;
    intersectionLength?: number;
    percentageOverlap?: number;
    intersectingPoints?: number[][];
  };
  recommendations: string[];
}

interface UploadedFile {
  name: string;
  content: GeoJSON | GeoJSONFeature[] | GeoJSONFeature;
  type: string;
  bbox: number[];
}

const spatialDataTypes = [
  { value: 'LINESTRING', label: 'LINESTRING' },
  { value: 'POLYGON', label: 'POLYGON' },
  { value: 'POINT', label: 'POINT' },
];

const generateIntersectionPointsGeoJSON = (points: number[][]) => {
  return {
    type: 'FeatureCollection',
    features: points.map((coords, idx) => ({
      type: 'Feature',
      properties: {
        id: idx + 1,
        description: `Titik Potong ${idx + 1}`,
      },
      geometry: {
        type: 'Point',
        coordinates: coords,
      },
    })),
  };
};

const analyzeGeometry = (uploadedFeature: GeoJSONFeature, existingFeatures: GeoJSONFeature[]): EnhancedAnalysis => {
  const analysis: EnhancedAnalysis = {
    overlappingBoundaries: [],
    metrics: {},
    recommendations: [],
  };

  if (uploadedFeature.geometry.type.includes('Polygon')) {
    const area = turf.area(uploadedFeature);
    analysis.metrics.uploadedArea = Number((area / 1000000).toFixed(2));
  } else if (uploadedFeature.geometry.type.includes('LineString')) {
    const length = turf.length(uploadedFeature);
    analysis.metrics.uploadedLength = Number(length.toFixed(2));
  }

  let totalIntersectionLength = 0;
  let intersectionPoints: number[][] = [];

  existingFeatures.forEach((existingFeature) => {
    const isOverlapping = turf.booleanIntersects(uploadedFeature, existingFeature);
    if (isOverlapping) {
      if (existingFeature.properties.namobj) {
        const boundaryName = generateBoundaryName(existingFeature.properties.namobj);
        analysis.overlappingBoundaries.push(boundaryName);
      }

      const intersection = turf.lineIntersect(uploadedFeature, existingFeature);
      if (intersection.features.length > 0) {
        const points = intersection.features.map((f) => {
          const coords = f.geometry.coordinates as number[];
          return [Number(coords[0].toFixed(6)), Number(coords[1].toFixed(6))];
        });
        intersectionPoints.push(...points);
      }

      if (uploadedFeature.geometry.type.includes('LineString')) {
        const intersectingLine = turf.lineOverlap(uploadedFeature, existingFeature);
        const overlapLength = turf.length(intersectingLine);
        totalIntersectionLength += overlapLength;
      }
    }
  });

  if (totalIntersectionLength > 0) {
    analysis.metrics.intersectionLength = Number(totalIntersectionLength.toFixed(2));
    if (analysis.metrics.uploadedLength) {
      analysis.metrics.percentageOverlap = Number(
        ((totalIntersectionLength / analysis.metrics.uploadedLength) * 100).toFixed(1)
      );
    }
  }

  analysis.metrics.intersectingPoints = intersectionPoints;
  analysis.recommendations = generateRecommendations(analysis, intersectionPoints);
  return analysis;
};

const generateBoundaryName = (namobj: string): string => {
  const parts = namobj.split(' - ').map((part) => part.trim());
  if (parts.length === 2) {
    const [kabupaten, secondPart] = parts;
    const isKota = secondPart.startsWith('Kota');
    const secondLayer = isKota ? secondPart : `Kabupaten ${secondPart}`;
    return `Batas antara Kabupaten ${kabupaten} dan ${secondLayer}`;
  }
  return `Batas Kabupaten ${parts[0]}`;
};

const generateRecommendations = (analysis: EnhancedAnalysis, intersectionPoints: number[][]): string[] => {
  const recommendations: string[] = [];
  if (analysis.overlappingBoundaries.length > 0) {
    if (analysis.metrics.percentageOverlap && analysis.metrics.percentageOverlap > 80) {
      recommendations.push(
        'Area ini berada di zona perbatasan dengan overlap yang signifikan. Pertimbangkan untuk berkonsultasi dengan kedua kabupaten/kota terkait.'
      );
    }
    if (intersectionPoints.length > 0) {
      recommendations.push('Titik-titik perpotongan dengan batas administratif:');
      intersectionPoints.forEach((point, index) => {
        recommendations.push(`- Titik ${index + 1}: ${point[0]}° BT, ${point[1]}° LS`);
      });
      recommendations.push('Disarankan untuk melakukan verifikasi lapangan pada titik-titik tersebut.');
    }
  }
  return recommendations;
};

const CheckAreaBoundary: React.FC = () => {
  const { files, isUploading, handleFileUpload, deleteFile } = useGeospatialUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string[]>([]);
  const [currentIntersectionPoints, setCurrentIntersectionPoints] = useState<number[][]>([]);
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

  const handleDownloadPointsShapefile = () => {
    if (currentIntersectionPoints.length === 0) return;

    const pointsGeoJSON = generateIntersectionPointsGeoJSON(currentIntersectionPoints);
    const options = {
      folder: 'Titik_Potong',
      filename: 'Titik_Potong',
      outputType: 'blob' as const,
      types: {
        point: 'Titik_Potong',
      },
    };

    shpwrite.zip(pointsGeoJSON, options).then((blob) => {
      saveAs(blob, 'Titik_Potong.zip');
    });
  };

  const handleDownloadPointsGeoJSON = () => {
    if (currentIntersectionPoints.length === 0) return;

    const pointsGeoJSON = generateIntersectionPointsGeoJSON(currentIntersectionPoints);
    const blob = new Blob([JSON.stringify(pointsGeoJSON, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'Titik_Potong.geojson');
  };

  const handleCheckOverlay = (file: UploadedFile) => {
    if (isLoading) {
      alert('Existing data is still loading. Please try again later.');
      return;
    }

    if (error) {
      alert('Error fetching existing data. Please try again later.');
      return;
    }

    if (!existingData) {
      alert('No existing data available.');
      return;
    }

    let uploadedFeatures: GeoJSONFeature[] = [];
    if (file.content.type === 'FeatureCollection' && Array.isArray(file.content.features)) {
      uploadedFeatures = file.content.features;
    } else if (file.content.type === 'Feature') {
      uploadedFeatures = [file.content];
    } else {
      alert('Unsupported GeoJSON type. Please upload a valid Feature or FeatureCollection.');
      return;
    }

    const existingFeatures = existingData.features;
    const allAnalyses: EnhancedAnalysis[] = [];
    let allIntersectionPoints: number[][] = [];

    uploadedFeatures.forEach((uploadedFeature) => {
      if (!uploadedFeature.geometry) {
        console.warn('Uploaded feature has no geometry:', uploadedFeature);
        return;
      }

      const analysis = analyzeGeometry(uploadedFeature, existingFeatures);
      allAnalyses.push(analysis);
      if (analysis.metrics.intersectingPoints) {
        allIntersectionPoints = [...allIntersectionPoints, ...analysis.metrics.intersectingPoints];
      }
    });

    const combinedContent: string[] = [];
    allAnalyses.forEach((analysis, index) => {
      if (index > 0) combinedContent.push('---');

      if (analysis.overlappingBoundaries.length > 0) {
        combinedContent.push('Data spasial ini overlap dengan:');
        combinedContent.push(...analysis.overlappingBoundaries);
        combinedContent.push('');
      }

      combinedContent.push('Metrik Analisis:');
      if (analysis.metrics.uploadedArea !== undefined) {
        combinedContent.push(`- Luas area: ${analysis.metrics.uploadedArea} km²`);
      }
      if (analysis.metrics.uploadedLength !== undefined) {
        combinedContent.push(`- Panjang area: ${analysis.metrics.uploadedLength} km`);
      }
      if (analysis.metrics.intersectionLength !== undefined) {
        combinedContent.push(`- Panjang overlap: ${analysis.metrics.intersectionLength} km`);
      }
      if (analysis.metrics.percentageOverlap !== undefined) {
        combinedContent.push(`- Persentase overlap: ${analysis.metrics.percentageOverlap}%`);
      }

      combinedContent.push('');
      combinedContent.push('Rekomendasi:');
      combinedContent.push(...analysis.recommendations);
    });

    setCurrentIntersectionPoints(allIntersectionPoints);
    setModalContent(combinedContent);
    setIsModalOpen(true);
  };

  const downloadButtons =
    currentIntersectionPoints.length > 0 ? (
      <>
        <button
          onClick={handleDownloadPointsShapefile}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          aria-label="Download Shapefile"
        >
          <FaDownload className="mr-2" />
          Titik Potong (SHP)
        </button>
        <button
          onClick={handleDownloadPointsGeoJSON}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
          aria-label="Download CSV"
        >
          <FaDownload className="mr-2" />
          Titik Potong (GeoJSON)
        </button>
      </>
    ) : null;

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
          <p className="text-md font-semibold mb-2">Data Spasial yang terunggah:</p>
          <ul className="pb-2">
            {files.map((file, index) => (
              <li key={index} className="mb-2 last:mb-0">
                <div className="flex items-center justify-between border rounded p-2 text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{file.name}</span>
                    <div className="flex mt-1 space-x-1">
                      <button
                        onClick={() => handleCheckOverlay(file)}
                        className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                        title="Check Overlay"
                      >
                        <FaCalculator className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => deleteFile(file.name)}
                        className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                        title="Delete File"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="w-1 h-10 rounded" style={{ backgroundColor: 'rgba(255, 0, 0, 1)' }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Analisis Spasial"
        extraFooterButton={downloadButtons}
      >
        <div className="space-y-2">
          {modalContent.map((item, idx) => (
            <p key={idx} className={item === '---' ? 'border-t my-4' : ''}>
              {item !== '---' ? item : ''}
            </p>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default CheckAreaBoundary;
