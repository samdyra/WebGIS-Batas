import React, { useState, useEffect } from 'react';
import useQueryLayerGroup from '../../admin/LayerGroup/hooks/useQueryLayerGroup';
import { FaEye, FaEyeSlash, FaSearch, FaTable, FaChevronRight, FaTimes } from 'react-icons/fa';
import useIDStore from '../hooks/useIDStore';
import useZoomToCoordinate from '../hooks/useZoomToCoordinate';
import PropViewer from './PropViewer';
import { motion, AnimatePresence } from 'framer-motion';

const LayerManagement: React.FC = () => {
  const { data } = useQueryLayerGroup();
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const { addID, removeID, ids, clearIDs } = useIDStore();
  const { setCoordinateValue } = useZoomToCoordinate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTableName, setSelectedTableName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Prevent body from scrolling when LayerManagement is mounted
    document.body.style.overflow = 'hidden';
    return () => {
      // Restore body scrolling when LayerManagement is unmounted
      document.body.style.overflow = 'auto';
    };
  }, []);

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

  // Group operations
  const handleShowAllInGroup = (layers: { layer_id: number }[]) => {
    layers.forEach((layer) => {
      if (!ids.includes(layer.layer_id)) {
        addID(layer.layer_id);
      }
    });
  };

  const handleHideAllInGroup = (layers: { layer_id: number }[]) => {
    layers.forEach((layer) => {
      if (ids.includes(layer.layer_id)) {
        removeID(layer.layer_id);
      }
    });
  };

  const filteredGroups = data?.filter((group) => group.group_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-screen relative">
      {/* Fixed Search Bar */}
      <div className="sticky top-0 bg-white z-10 p-3 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-16">
        {filteredGroups?.map((layerGroup) => (
          <div key={layerGroup.group_id} className="border-b border-gray-200">
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.1 }}
                  className="overflow-hidden"
                >
                  {/* Group Controls */}
                  <div className="flex gap-2 px-3 mb-2">
                    <button
                      onClick={() => handleShowAllInGroup(layerGroup.layers)}
                      className="flex-1 text-xs py-1 border border-slate-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1"
                    >
                      Lihat Semua Layer
                    </button>
                    <button
                      onClick={() => handleHideAllInGroup(layerGroup.layers)}
                      className="flex-1 text-xs py-1 border border-slate-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1"
                    >
                      Tutup Semua Layer
                    </button>
                  </div>

                  {/* Layer List */}
                  <ul className="px-3 pb-2">
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
                                onClick={() => handleShowAttributes(convertToSnakeCase(layer.table_name))}
                              >
                                <FaTable className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="w-1 h-10 rounded" style={{ backgroundColor: layer.color }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Fixed Clear Button */}
      <div className="sticky bottom-0 bg-white border-t p-3 mt-lg">
        <button
          onClick={clearIDs}
          className="w-full border border-slate-700 py-1 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm"
        >
          Tutup Semua Layer
        </button>
      </div>

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
