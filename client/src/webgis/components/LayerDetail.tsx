import useFeatureData from '../hooks/useGetFeature';

const LayerDetail = () => {
  const { getFeatureData } = useFeatureData();
  const featureData = getFeatureData();
  return (
    <div>
      {featureData ? (
        <div
          className="h-fit overflow-scroll"
          style={{
            height: 'calc(100vh - 12rem)',
          }}
        >
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(featureData).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-xs">{key}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-xs">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-64 text-gray-500">Click on the map to get details</p>
      )}
    </div>
  );
};

export default LayerDetail;
