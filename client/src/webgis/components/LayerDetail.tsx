import useFeatureData from '../hooks/useGetFeature';

const LayerDetail = () => {
  const { getFeatureData } = useFeatureData();
  const featureData = getFeatureData();

  if (!featureData) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500 text-sm">Click on the map to get details</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">{featureData.layerName}</h2>
      </div>
      <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Property
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(featureData.properties).map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{key}</td>
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LayerDetail;
