import React, { useState } from 'react';
import { Modal } from '../../admin/shared/components/Modal';
import { FaSpinner, FaDownload } from 'react-icons/fa';
import { usePropData } from '../../shared/hooks/usePropData';
import shpwrite from '@mapbox/shp-write';
// @ts-ignore
import { saveAs } from 'file-saver'; // Import saveAs from file-saver

function convertFromSnakeCase(str: string): string {
  return str
    ?.split('_')
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    ?.join(' ');
}

interface PropViewerProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
}

const PropViewer: React.FC<PropViewerProps> = ({ isOpen, onClose, tableName }) => {
  const { data, error, isLoading } = usePropData(tableName);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const columns = data?.features?.length ?? 0 > 0 ? Object.keys(data?.features[0].properties ?? {}) : [];

  // Function to handle Shapefile download
  const handleDownloadShapefile = async () => {
    if (!data) {
      alert('No data available to download.');
      return;
    }

    const options = {
      folder: convertFromSnakeCase(tableName), // Folder name inside ZIP
      filename: convertFromSnakeCase(tableName), // Base filename for ZIP
      outputType: 'blob' as const, // Output as Blob
      compression: 'DEFLATE' as const, // Compression method
      types: {
        point: convertFromSnakeCase(tableName), // Shapefile type names
        polygon: convertFromSnakeCase(tableName),
        polyline: convertFromSnakeCase(tableName),
      },
    };

    try {
      setIsDownloading(true);
      setDownloadError(null);

      // Generate the ZIP blob
      // @ts-ignore
      const zipData = await shpwrite.zip(data, options);

      // Trigger the download using FileSaver
      saveAs(zipData, `${options.filename}.zip`);
    } catch (err) {
      console.error('Error downloading Shapefile:', err);
      setDownloadError('Failed to download Shapefile.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Table Atribut ${convertFromSnakeCase(tableName)}`}>
      <div className="flex justify-end p-4">
        <button
          onClick={handleDownloadShapefile}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          disabled={isDownloading}
        >
          <FaDownload className="mr-2" />
          {isDownloading ? 'Downloading...' : 'Download Shapefile'}
        </button>
      </div>
      {downloadError && <p className="text-red-500 text-center">{downloadError}</p>}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">Something Went Wrong</p>
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
                    {convertFromSnakeCase(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.features?.map((feature, index) => (
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
