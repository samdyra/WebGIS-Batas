import React, { useState, useEffect } from 'react';
import { Modal } from '../../admin/shared/components/Modal';
import { FaSpinner } from 'react-icons/fa'; // For loading spinner

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

function convertFromSnakeCase(str: string): string {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

interface PropViewerProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
}

const PropViewer: React.FC<PropViewerProps> = ({ isOpen, onClose, tableName }) => {
  const [features, setFeatures] = useState<GeoJSONFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tableName) {
      fetchGeoJSONData(tableName);
    }
  }, [isOpen, tableName]);

  const fetchGeoJSONData = async (tableName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/geojson/${tableName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch GeoJSON data');
      }
      const data = await response.json();
      if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
        setFeatures(data.features);
      } else {
        throw new Error('Invalid GeoJSON structure');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = features.length > 0 ? Object.keys(features[0].properties) : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Table Atribut ${convertFromSnakeCase(tableName)}`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {features.map((feature, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200"
                    >
                      {feature.properties[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default PropViewer;
