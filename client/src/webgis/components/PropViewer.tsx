import React from 'react';
import { Modal } from '../../admin/shared/components/Modal';
import { FaSpinner } from 'react-icons/fa'; // For loading spinner
import { usePropData } from '../../shared/hooks/usePropData';

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

  const columns = data?.features?.length ?? 0 > 0 ? Object.keys(data?.features?.[0]?.properties ?? []) : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Table Atribut ${convertFromSnakeCase(tableName)}`}>
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
                    {column}
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
