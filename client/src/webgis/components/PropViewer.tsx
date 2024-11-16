import React, { useState } from 'react';
import { Modal } from '../../admin/shared/components/Modal';
import { FaSpinner, FaDownload, FaSave } from 'react-icons/fa';
import { usePropData } from '../../shared/hooks/usePropData';
import shpwrite from '@mapbox/shp-write';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

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
  const [isDownloadingShapefile, setIsDownloadingShapefile] = useState(false);
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const columns = data?.features?.length ?? 0 > 0 ? Object.keys(data?.features[0].properties ?? {}) : [];

  // Function to handle Shapefile download
  const handleDownloadShapefile = async () => {
    if (!data) {
      alert('No data available to download.');
      return;
    }

    const options = {
      folder: convertFromSnakeCase(tableName),
      filename: convertFromSnakeCase(tableName),
      outputType: 'blob' as const,
      compression: 'DEFLATE' as const,
      types: {
        point: convertFromSnakeCase(tableName),
        polygon: convertFromSnakeCase(tableName),
        polyline: convertFromSnakeCase(tableName),
      },
    };

    try {
      setIsDownloadingShapefile(true);
      setDownloadError(null);

      const zipData = await shpwrite.zip(data, options);
      saveAs(zipData, `${options.filename}.zip`);
    } catch (err) {
      console.error('Error downloading Shapefile:', err);
      if (err instanceof Error) {
        setDownloadError(`Failed to download Shapefile: ${err.message}`);
      } else {
        setDownloadError('Failed to download Shapefile.');
      }
    } finally {
      setIsDownloadingShapefile(false);
    }
  };

  // Function to handle CSV download
  const handleDownloadCSV = () => {
    if (!data) {
      alert('No data available to download.');
      return;
    }

    try {
      setIsDownloadingCSV(true);
      setDownloadError(null);

      const csvData = data.features.map((feature) => feature.properties);
      const formattedCsvData = csvData.map((item) => {
        const formattedItem: { [key: string]: any } = {};
        Object.keys(item).forEach((key) => {
          formattedItem[convertFromSnakeCase(key)] = item[key] ?? '';
        });
        return formattedItem;
      });

      const csv = Papa.unparse(formattedCsvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${convertFromSnakeCase(tableName)}.csv`);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      if (err instanceof Error) {
        setDownloadError(`Failed to download CSV: ${err.message}`);
      } else {
        setDownloadError('Failed to download CSV.');
      }
    } finally {
      setIsDownloadingCSV(false);
    }
  };

  // Consolidate all footer buttons
  const footerButtons = (
    <>
      <button
        onClick={handleDownloadShapefile}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
        disabled={isDownloadingShapefile}
        aria-label="Download Shapefile"
      >
        <FaDownload className="mr-2" />
        {isDownloadingShapefile ? 'Downloading Shapefile...' : 'Download Shapefile'}
      </button>
      <button
        onClick={handleDownloadCSV}
        className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        disabled={isDownloadingCSV}
        aria-label="Download CSV"
      >
        <FaDownload className="mr-2" />
        {isDownloadingCSV ? 'Downloading CSV...' : 'Download CSV'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Table Atribut ${convertFromSnakeCase(tableName)}`}
      extraFooterButton={footerButtons} // Passing all footer buttons
    >
      {/* Content: Loading, Error, or Table */}
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

      {/* Error Message for Downloads */}
      {downloadError && <p className="text-red-500 text-center">{downloadError}</p>}
    </Modal>
  );
};

export default PropViewer;
