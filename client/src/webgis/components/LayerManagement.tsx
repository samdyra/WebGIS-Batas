import React, { useState } from 'react';
import useQueryLayerGroup from '../../admin/LayerGroup/hooks/useQueryLayerGroup';
import { FaEye, FaEyeSlash, FaSearch, FaTable, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import useIDStore from '../hooks/useIDStore';
import useZoomToCoordinate from '../hooks/useZoomToCoordinate';
import PropViewer from './PropViewer'; // Make sure this path is correct

const LayerManagement: React.FC = () => {
  const { data } = useQueryLayerGroup();
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const { addID, removeID, ids } = useIDStore();
  const { setCoordinateValue } = useZoomToCoordinate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
  const [selectedTableName, setSelectedTableName] = useState<string>('');

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]));
  };

  const handleToggleVisibility = (layerId: number) => {
    if (ids.includes(layerId)) {
      removeID(layerId);
    } else {
      addID(layerId);
    }
  };

  const handleZoom = (lat: number, lng: number) => {
    setCoordinateValue(lat, lng);
  };

  const handleShowAttributes = (layerId: number, tableName: string) => {
    setSelectedLayerId(layerId);
    setSelectedTableName(tableName);
    setModalOpen(true);
  };

  return (
    <>
      <main className="border-2 mx-sm rounded-md h-full mb-2 overflow-auto">
        {data?.map((layerGroup) => (
          <div key={layerGroup.group_id} className="border-b-2 border-gray-200 last:border-b-0">
            <div
              className="flex items-center justify-between p-sm cursor-pointer hover:bg-gray-100"
              onClick={() => toggleGroup(layerGroup.group_id)}
            >
              <h3 className="text-lg font-semibold">{layerGroup.group_name}</h3>
              {expandedGroups.includes(layerGroup.group_id) ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {expandedGroups.includes(layerGroup.group_id) && (
              <ul className="px-sm pb-sm">
                {layerGroup.layers.map((layer) => (
                  <li key={layer.layer_id} className="mb-2 last:mb-0">
                    <div className="flex items-center justify-between border-2 p-2 rounded">
                      <div className="flex flex-col">
                        <span className="font-medium">{layer.layer_name}</span>
                        <div className="flex mt-2 space-x-2">
                          <button
                            onClick={() => handleToggleVisibility(layer.layer_id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {ids.includes(layer.layer_id) ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button
                            onClick={() => handleZoom(layer.coordinate[1], layer.coordinate[0])}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <FaSearch />
                          </button>
                          <button
                            onClick={() => handleShowAttributes(layer.layer_id, convertToSnakeCase(layer.layer_name))}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <FaTable />
                          </button>
                        </div>
                      </div>
                      <div className="w-[2px] h-14" style={{ backgroundColor: layer.color }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </main>
      <PropViewer
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        layerId={selectedLayerId}
        tableName={selectedTableName}
      />
    </>
  );
};

export default LayerManagement;

function convertToSnakeCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}
