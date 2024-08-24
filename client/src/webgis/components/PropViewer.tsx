import React, { useState, useEffect } from 'react';

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

interface PropViewerProps {
  isOpen: boolean;
  onClose: () => void;
  layerId: number | null;
  tableName: string;
}

const PropViewer: React.FC<PropViewerProps> = ({ isOpen, onClose, layerId, tableName }) => {
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

  if (!isOpen) return null;

  const columns = features.length > 0 ? Object.keys(features[0].properties) : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
        style={{ zIndex: 10 }}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-xl z-50 w-11/12 max-w-4xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Layer {layerId} Properties ({tableName})
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-grow overflow-hidden p-4">
            {isLoading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!isLoading && !error && (
              <div className="overflow-auto max-h-[calc(90vh-8rem)]">
                <table className="min-w-full bg-white border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default PropViewer;
