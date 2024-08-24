import React, { useState } from 'react';
import useQueryLayerGroup from '../../admin/LayerGroup/hooks/useQueryLayerGroup';
import { FaEye, FaEyeSlash, FaSearch, FaTable, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import useIDStore from '../hooks/useIDStore';
import useZoomToCoordinate from '../hooks/useZoomToCoordinate';
import PropViewer from './PropViewer';
import { motion, AnimatePresence } from 'framer-motion';

const LayerManagement: React.FC = () => {
  const { data } = useQueryLayerGroup();
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const { addID, removeID, ids } = useIDStore();
  const { setCoordinateValue } = useZoomToCoordinate();
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleShowAttributes = (tableName: string) => {
    setSelectedTableName(tableName);
    setModalOpen(true);
  };

  return (
    <div className="max-w-md bg-white rounded-lg overflow-hidden">
      {data?.map((layerGroup) => (
        <div key={layerGroup.group_id} className="border-b border-gray-200 ">
          <button
            className="flex items-center justify-between w-full p-3 text-sm font-medium hover:bg-gray-50 focus:outline-none"
            onClick={() => toggleGroup(layerGroup.group_id)}
          >
            <span>{layerGroup.group_name}</span>
            <motion.div
              initial={false}
              animate={{ rotate: expandedGroups.includes(layerGroup.group_id) ? 90 : 0 }}
              transition={{ duration: 0.1 }}
            >
              <FaChevronRight className="h-4 w-4" />
            </motion.div>
          </button>
          <AnimatePresence>
            {expandedGroups.includes(layerGroup.group_id) && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.1 }}
                className="px-3 pb-2 overflow-hidden"
              >
                {layerGroup.layers.map((layer) => (
                  <li key={layer.layer_id} className="mb-2 last:mb-0">
                    <div className="flex items-center justify-between border rounded p-2 text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium">{layer.layer_name}</span>
                        <div className="flex mt-1 space-x-1">
                          <button
                            className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                            onClick={() => handleToggleVisibility(layer.layer_id)}
                          >
                            {ids.includes(layer.layer_id) ? (
                              <FaEyeSlash className="h-3 w-3" />
                            ) : (
                              <FaEye className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                            onClick={() => handleZoom(layer.coordinate[1], layer.coordinate[0])}
                          >
                            <FaSearch className="h-3 w-3" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                            onClick={() => handleShowAttributes(convertToSnakeCase(layer.layer_name))}
                          >
                            <FaTable className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="w-1 h-10 rounded" style={{ backgroundColor: layer.color }} />
                    </div>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
      <PropViewer isOpen={modalOpen} onClose={() => setModalOpen(false)} tableName={selectedTableName} />
    </div>
  );
};

export default LayerManagement;

function convertToSnakeCase(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}
